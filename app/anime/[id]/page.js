"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import {
  getAnimeFullById,
  getAnimeCharacters,
  getAnimeEpisodes,
  getAnimeRelations,
} from "@/lib/api";
import {
  FiArrowLeft,
  FiChevronUp,
  FiStar,
  FiPlay,
  FiCalendar,
  FiUsers,
  FiAward,
  FiCheck,
  FiPlus,
} from "react-icons/fi";

export default function AnimeDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [anime, setAnime] = useState(null);
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("info");
  const tabs = [
    { key: "info", label: "INFORMATION" },
    { key: "characters", label: "CHARACTERS" },
    { key: "episodes", label: "EPISODES" },
  ];

  // Local pagination states for characters (kept)
  const [allCharacters, setAllCharacters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [charactersPage, setCharactersPage] = useState(1);
  const [charactersPagination, setCharactersPagination] = useState(null);
  const [charactersLoading, setCharactersLoading] = useState(false);

  // Episodes: server-side pagination (no more allEpisodes slice)
  const [episodes, setEpisodes] = useState([]);
  const [episodesPage, setEpisodesPage] = useState(1);
  const [episodesPagination, setEpisodesPagination] = useState(null);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Scroll button
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setShowScroll(window.scrollY > 400);
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Date formatting helper
  const formatEpisodeDate = (raw) => {
    if (!raw) return "Unknown Date";
    const possible = raw?.prop?.from || raw?.from || raw?.aired_from || raw;
    try {
      const d = new Date(possible);
      if (isNaN(d.getTime())) return "Unknown Date";
      return d.toLocaleDateString("en-GB");
    } catch {
      return "Unknown Date";
    }
  };

  // Fetch anime full info
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    async function fetchAnimeData() {
      try {
        const fullResp = await getAnimeFullById(id);
        const full = fullResp?.data ?? null;
        if (!mountedRef.current) return;
        setAnime(full);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err?.message || "Failed to load data");
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
      }
    }

    fetchAnimeData();
  }, [id]);

  // Reset pagination page when id changes (avoid stale page)
  useEffect(() => {
    setCharactersPage(1);
    setEpisodesPage(1);
  }, [id]);

  // Fetch relations (no pagination)
  useEffect(() => {
    if (!id) return;
    async function fetchRelations() {
      try {
        const relsResp = await getAnimeRelations(id);
        const rels = relsResp?.data ?? [];
        if (!mountedRef.current) return;
        setRelations(Array.isArray(rels) ? rels : []);
      } catch (err) {
        console.error("Failed to load relations:", err);
      }
    }
    fetchRelations();
  }, [id]);

  // === CHARACTERS LOCAL PAGINATION ===
  useEffect(() => {
    if (!id || activeTab !== "characters") return;
    async function fetchCharacters() {
      try {
        const charsResp = await getAnimeCharacters(id);
        const chars = charsResp?.data ?? [];
        if (!mountedRef.current) return;
        setAllCharacters(Array.isArray(chars) ? chars : []);
      } catch (err) {
        console.error("Failed to load characters:", err);
      }
    }
    fetchCharacters();
  }, [id, activeTab]);

  useEffect(() => {
    const itemsPerPage = 10;
    const startIndex = (charactersPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setCharactersLoading(true);
    setTimeout(() => {
      setCharacters(allCharacters.slice(startIndex, endIndex));
      const totalPages = Math.ceil(allCharacters.length / itemsPerPage) || 1;
      setCharactersPagination({ last_visible_page: totalPages });
      setCharactersLoading(false);
    }, 300);
  }, [allCharacters, charactersPage]);

  // === EPISODES SERVER PAGINATION ===
  useEffect(() => {
    if (!id || activeTab !== "episodes") return;
    let cancelled = false;

    async function fetchEpisodes() {
      setEpisodesLoading(true);
      try {
        const epsResp = await getAnimeEpisodes(id, episodesPage);
        if (cancelled || !mountedRef.current) return;
        const eps = epsResp?.data ?? [];
        const pagination = epsResp?.pagination ?? {};
        setEpisodes(Array.isArray(eps) ? eps : []);
        setEpisodesPagination(pagination);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load episodes:", err);
          setEpisodes([]);
          setEpisodesPagination(null);
        }
      } finally {
        if (!cancelled && mountedRef.current) setEpisodesLoading(false);
      }
    }

    fetchEpisodes();

    return () => {
      cancelled = true;
    };
  }, [id, activeTab, episodesPage]);

  // Reset pagination when switching tabs
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === "characters") setCharactersPage(1);
    else if (tabKey === "episodes") setEpisodesPage(1);
  };

  // Check initial playlist state
  useEffect(() => {
    if (anime?.mal_id) {
      playlistHelpers.isInPlaylist(anime.mal_id).then(setIsInPlaylist);
    }
  }, [anime]);

  // Handle add to playlist
  const handleAddToPlaylist = async () => {
    if (isPlaylistLoading || !anime) return;

    setIsPlaylistLoading(true);
    try {
      if (isInPlaylist) {
        const success = await playlistHelpers.removeFromPlaylist(anime.mal_id);
        if (success) {
          setIsInPlaylist(false);
        }
      } else {
        const success = await playlistHelpers.addToPlaylist(anime);
        if (success) {
          setIsInPlaylist(true);
        }
      }
    } catch (error) {
      console.error("Playlist operation failed:", error);
    } finally {
      setIsPlaylistLoading(false);
    }
  };

  // Invalid ID fallback
  if (!id) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white text-lg">Invalid Anime ID</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 py-20">
        {/* Header */}
        <section className="relative py-8 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a2f] border border-[#543864] hover:border-[#FF6363] text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                <FiArrowLeft size={18} />
                <span className="font-semibold">BACK</span>
              </button>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white truncate">
                  {anime?.title ?? "ANIME DETAILS"}
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && !error && (
          <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-8 animate-pulse">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-80 h-96 bg-[#543864]/50 rounded-xl"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-[#543864]/50 rounded w-3/4"></div>
                    <div className="h-4 bg-[#543864]/50 rounded w-1/2"></div>
                    <div className="h-4 bg-[#543864]/50 rounded w-2/3"></div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-4 bg-[#543864]/50 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-8 text-center">
                <div className="text-[#FF6363] text-lg font-semibold mb-2">
                  {error}
                </div>
                <p className="text-white/60">Please try refreshing the page</p>
              </div>
            </div>
          </section>
        )}

        {/* Content - Only show when not loading and no error */}
        {!loading && !error && anime && (
          <>
            {/* Tabs */}
            <section className="py-6 bg-[#0f0f1f] border-b border-[#543864]">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleTabChange(tab.key)}
                      className={`px-6 py-3 font-bold rounded-xl transition-all duration-300 border ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-[#0f0f1f] border-transparent"
                          : "bg-[#1a1a2f] border-[#543864] text-white/80 hover:text-white hover:border-[#FF6363]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* === INFORMATION TAB === */}
            {activeTab === "info" && (
              <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl overflow-hidden">
                    {/* Hero Section */}
                    <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-8">
                      {/* Left: Image & Trailer */}
                      <div className="flex-shrink-0 w-full lg:w-80 space-y-6">
                        {/* Main Image */}
                        <div className="relative w-full h-96 lg:h-[420px] rounded-xl overflow-hidden border-2 border-[#543864]">
                          {anime.images?.jpg?.large_image_url ? (
                            <Image
                              src={anime.images.jpg.large_image_url}
                              alt={anime.title || "Anime image"}
                              fill
                              sizes="(max-width: 1024px) 100vw, 320px"
                              className="object-cover"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#543864]/50 text-white/40">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Trailer */}
                        {anime.trailer?.embed_url && (
                          <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#543864]">
                            <iframe
                              src={anime.trailer.embed_url}
                              title={`${anime.title} - Trailer`}
                              className="w-full h-full"
                              allowFullScreen
                            />
                          </div>
                        )}

                        {/* Add to Playlist Button */}
                        <div className="flex justify-center mt-4">
                          <button
                            onClick={handleAddToPlaylist}
                            disabled={isPlaylistLoading}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                              isInPlaylist
                                ? "bg-[#FF6363] text-white hover:bg-[#ff5252]"
                                : "bg-[#543864] text-white hover:bg-[#4a3157]"
                            } ${
                              isPlaylistLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:scale-105"
                            }`}
                          >
                            {isPlaylistLoading ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : isInPlaylist ? (
                              <>
                                <FiCheck className="text-lg" />
                                <span>In Playlist</span>
                              </>
                            ) : (
                              <>
                                <FiPlus className="text-lg" />
                                <span>Add to Playlist</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Right: Details */}
                      <div className="flex-1 space-y-6">
                        {/* Title & Basic Info */}
                        <div>
                          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                            {anime.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 text-white/60 mb-4">
                            {anime.title_english && (
                              <span className="text-lg">
                                {anime.title_english}
                              </span>
                            )}
                            {anime.title_japanese && (
                              <span className="text-sm">
                                ({anime.title_japanese})
                              </span>
                            )}
                            {anime.year && (
                              <span className="text-[#FFBD69] font-semibold">
                                ({anime.year})
                              </span>
                            )}
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {anime.score && (
                              <div className="bg-[#543864] rounded-xl p-4 text-center border border-[#543864] hover:border-[#FFBD69] transition-colors duration-300">
                                <FiStar className="text-[#FFBD69] text-xl mx-auto mb-2" />
                                <div className="text-white font-bold text-lg">
                                  {anime.score}
                                </div>
                                <div className="text-white/60 text-sm">
                                  SCORE
                                </div>
                              </div>
                            )}
                            {anime.rank && (
                              <div className="bg-[#543864] rounded-xl p-4 text-center border border-[#543864] hover:border-[#FF6363] transition-colors duration-300">
                                <FiAward className="text-[#FF6363] text-xl mx-auto mb-2" />
                                <div className="text-white font-bold text-lg">
                                  #{anime.rank}
                                </div>
                                <div className="text-white/60 text-sm">
                                  RANK
                                </div>
                              </div>
                            )}
                            {anime.popularity && (
                              <div className="bg-[#543864] rounded-xl p-4 text-center border border-[#543864] hover:border-[#FFBD69] transition-colors duration-300">
                                <FiUsers className="text-[#FFBD69] text-xl mx-auto mb-2" />
                                <div className="text-white font-bold text-lg">
                                  #{anime.popularity}
                                </div>
                                <div className="text-white/60 text-sm">
                                  POPULARITY
                                </div>
                              </div>
                            )}
                            {anime.episodes && (
                              <div className="bg-[#543864] rounded-xl p-4 text-center border border-[#543864] hover:border-[#FF6363] transition-colors duration-300">
                                <FiPlay className="text-[#FF6363] text-xl mx-auto mb-2" />
                                <div className="text-white font-bold text-lg">
                                  {anime.episodes}
                                </div>
                                <div className="text-white/60 text-sm">
                                  EPISODES
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Synopsis */}
                        {anime.synopsis && (
                          <div className="bg-[#0f0f1f] rounded-xl p-6 border border-[#543864]">
                            <h3 className="text-xl font-black text-white mb-4 flex items-center">
                              <FiPlay className="text-[#FF6363] mr-2" />
                              SYNOPSIS
                            </h3>
                            <p className="text-white/80 leading-relaxed">
                              {anime.synopsis}
                            </p>
                          </div>
                        )}

                        {/* Background */}
                        {anime.background && (
                          <div className="bg-[#0f0f1f] rounded-xl p-6 border border-[#543864]">
                            <h3 className="text-xl font-black text-white mb-4">
                              BACKGROUND
                            </h3>
                            <p className="text-white/80 leading-relaxed">
                              {anime.background}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="border-t border-[#543864] p-6 md:p-8">
                      <h3 className="text-2xl font-black text-white mb-6 flex items-center">
                        <FiCalendar className="text-[#FFBD69] mr-2" />
                        ADDITIONAL INFORMATION
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-3">
                          <h4 className="text-[#FFBD69] font-bold text-lg">
                            BASIC INFO
                          </h4>
                          <InfoRow label="Type" value={anime.type} />
                          <InfoRow label="Source" value={anime.source} />
                          <InfoRow label="Status" value={anime.status} />
                          <InfoRow label="Duration" value={anime.duration} />
                          <InfoRow label="Rating" value={anime.rating} />
                        </div>

                        {/* Broadcast Info */}
                        <div className="space-y-3">
                          <h4 className="text-[#FFBD69] font-bold text-lg">
                            BROADCAST
                          </h4>
                          <InfoRow label="Aired" value={anime.aired?.string} />
                          <InfoRow
                            label="Broadcast"
                            value={anime.broadcast?.string}
                          />
                          <InfoRow label="Season" value={anime.season} />
                          <InfoRow label="Year" value={anime.year} />
                        </div>

                        {/* Production */}
                        <div className="space-y-3">
                          <h4 className="text-[#FFBD69] font-bold text-lg">
                            PRODUCTION
                          </h4>
                          <InfoRow
                            label="Studios"
                            value={anime.studios?.map((s) => s.name).join(", ")}
                          />
                          <InfoRow
                            label="Producers"
                            value={anime.producers
                              ?.map((p) => p.name)
                              .join(", ")}
                          />
                          <InfoRow
                            label="Licensors"
                            value={anime.licensors
                              ?.map((l) => l.name)
                              .join(", ")}
                          />
                          <InfoRow
                            label="Genres"
                            value={anime.genres?.map((g) => g.name).join(", ")}
                          />
                          <InfoRow
                            label="Themes"
                            value={anime.themes?.map((t) => t.name).join(", ")}
                          />
                        </div>
                      </div>

                      {/* Streaming Platforms */}
                      {anime.streaming?.length > 0 && (
                        <div className="mt-8">
                          <h4 className="text-[#FFBD69] font-bold text-lg mb-4">
                            STREAMING PLATFORMS
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {anime.streaming.map((s, i) => (
                              <a
                                key={s.url ?? i}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-[#0f0f1f] font-bold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-transparent"
                              >
                                {s.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Theme Songs */}
                      {anime.theme && (
                        <div className="mt-8 grid md:grid-cols-2 gap-6">
                          {anime.theme.openings?.length > 0 && (
                            <div>
                              <h4 className="text-[#FF6363] font-bold text-lg mb-3">
                                OPENING THEMES
                              </h4>
                              <ul className="space-y-2">
                                {anime.theme.openings.map((op, i) => (
                                  <li key={i} className="text-white/80 text-sm">
                                    🎵 {op}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {anime.theme.endings?.length > 0 && (
                            <div>
                              <h4 className="text-[#FFBD69] font-bold text-lg mb-3">
                                ENDING THEMES
                              </h4>
                              <ul className="space-y-2">
                                {anime.theme.endings.map((ed, i) => (
                                  <li key={i} className="text-white/80 text-sm">
                                    🎵 {ed}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Relations */}
                      {relations.length > 0 && (
                        <div className="mt-8">
                          <h4 className="text-[#FFBD69] font-bold text-lg mb-4">
                            RELATIONS
                          </h4>
                          <div className="space-y-3">
                            {relations.map((rel, i) => (
                              <div
                                key={i}
                                className="bg-[#0f0f1f] rounded-lg p-4 border border-[#543864]"
                              >
                                <span className="text-[#FF6363] font-semibold">
                                  {rel.relation}:
                                </span>
                                <span className="text-white/80 ml-2">
                                  {(rel.entry || [])
                                    .map((e) => e.name)
                                    .join(", ")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* === CHARACTERS TAB === */}
            {activeTab === "characters" && (
              <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-black text-white mb-6">
                      CHARACTERS & VOICE ACTORS
                    </h3>

                    {charactersLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-24 bg-[#543864]/40 rounded-xl animate-pulse"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {characters.map((ch, idx) => {
                          const char = ch?.character ?? {};
                          const img = char?.images?.jpg?.image_url;
                          const key = char?.mal_id ?? `ch-${idx}`;
                          return (
                            <div
                              key={key}
                              className="bg-[#0f0f1f] border border-[#543864] rounded-xl p-4 hover:border-[#FF6363] transition-all duration-300"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-[#FFBD69]">
                                  {img ? (
                                    <Image
                                      src={img}
                                      alt={char.name ?? "character"}
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#543864] text-white/40 text-xs">
                                      No Image
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-bold text-lg">
                                    {char.name ?? "Unknown"}
                                  </h4>
                                  <p className="text-[#FFBD69] text-sm font-medium">
                                    {ch?.role ?? "Unknown role"}
                                  </p>
                                  {ch.voice_actors?.length > 0 && (
                                    <p className="text-white/60 text-xs mt-1">
                                      VA: {ch.voice_actors[0]?.person?.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {charactersPagination &&
                      charactersPagination.last_visible_page > 1 && (
                        <div className="flex justify-center">
                          <Pagination
                            currentPage={charactersPage}
                            totalPages={charactersPagination.last_visible_page}
                            onPageChange={setCharactersPage}
                            loading={charactersLoading}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </section>
            )}

            {/* === EPISODES TAB === */}
            {activeTab === "episodes" && (
              <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-black text-white mb-6">
                      EPISODES
                    </h3>

                    {episodesLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-28 bg-[#543864]/40 rounded-xl animate-pulse"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {episodes.map((ep, idx) => {
                          const key = ep?.mal_id ?? `ep-${idx}`;

                          // Hitung nomor episode global (1 page = 100 data)
                          const absoluteIndex =
                            (episodesPage - 1) * 100 + (idx + 1);

                          return (
                            <div
                              key={key}
                              className="bg-[#0f0f1f] border border-[#543864] rounded-xl p-4 hover:border-[#FFBD69] transition-all duration-300"
                            >
                              <div className="text-[#FF6363] font-bold text-sm mb-2">
                                EPISODE {absoluteIndex}
                              </div>
                              <h4 className="text-white font-semibold mb-2 line-clamp-2">
                                {ep?.title ?? `Episode ${absoluteIndex}`}
                              </h4>
                              <p className="text-white/60 text-xs">
                                Aired: {formatEpisodeDate(ep?.aired)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {episodesPagination &&
                      (episodesPagination.last_visible_page ?? 0) > 1 && (
                        <div className="flex justify-center">
                          <Pagination
                            currentPage={
                              episodesPagination.current_page ?? episodesPage
                            }
                            totalPages={episodesPagination.last_visible_page}
                            onPageChange={(p) => setEpisodesPage(p)}
                            loading={episodesLoading}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Scroll to top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-[#0f0f1f] p-3 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <FiChevronUp size={20} />
        </button>
      )}

      <Footer />
    </div>
  );
}

// Helper component for info rows
function InfoRow({ label, value }) {
  if (!value || value === "N/A") return null;

  return (
    <div className="flex justify-between items-center py-2 border-b border-[#543864]/50">
      <span className="text-white/70 font-medium">{label}</span>
      <span className="text-white font-semibold text-right">{value}</span>
    </div>
  );
}
