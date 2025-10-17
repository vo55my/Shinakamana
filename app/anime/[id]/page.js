"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  getAnimeFullById,
  getAnimeCharacters,
  getAnimeEpisodes,
  getAnimeRelations,
} from "@/lib/api";
import { playlistHelpers } from "@/lib/playlistHelpers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import InfoSection from "@/components/info/InfoSection";
import LoadingState from "@/components/state/LoadingState";
import ErrorState from "@/components/state/ErrorState";
import TabNavigation from "@/components/section/anime/TabNavigation";
import AnimeDetailHeader from "@/components/section/anime/AnimeDetailHeader";
import AnimeInfoTab from "@/components/section/anime/AnimeInfoTab";
import AnimeCharactersTab from "@/components/section/anime/AnimeCharactersTab";
import AnimeEpisodesTab from "@/components/section/anime/AnimeEpisodesTab";
import { FiInfo } from "react-icons/fi";

export default function AnimeDetailPage() {
  const { id } = useParams();

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

  // Local pagination states for characters
  const [allCharacters, setAllCharacters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [charactersPage, setCharactersPage] = useState(1);
  const [charactersPagination, setCharactersPagination] = useState(null);
  const [charactersLoading, setCharactersLoading] = useState(false);

  // Episodes: server-side pagination
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

  // Reset pagination page when id changes
  useEffect(() => {
    setCharactersPage(1);
    setEpisodesPage(1);
  }, [id]);

  // Fetch relations
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
        <AnimeDetailHeader anime={anime} />

        {/* Loading State */}
        {loading && !error && <LoadingState />}

        {/* Error State */}
        {error && <ErrorState error={error} />}

        {/* Content - Only show when not loading and no error */}
        {!loading && !error && anime && (
          <>
            {/* Tabs */}
            <section className="py-6 bg-[#0f0f1f] border-b border-[#543864]">
              <div className="container mx-auto px-4 sm:px-6">
                <TabNavigation
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>
            </section>

            {/* === INFORMATION TAB === */}
            {activeTab === "info" && (
              <AnimeInfoTab
                anime={anime}
                relations={relations}
                isInPlaylist={isInPlaylist}
                isPlaylistLoading={isPlaylistLoading}
                onAddToPlaylist={handleAddToPlaylist}
              />
            )}

            {/* === CHARACTERS TAB === */}
            {activeTab === "characters" && (
              <AnimeCharactersTab
                characters={characters}
                charactersLoading={charactersLoading}
                charactersPagination={charactersPagination}
                charactersPage={charactersPage}
                onPageChange={setCharactersPage}
              />
            )}

            {/* === EPISODES TAB === */}
            {activeTab === "episodes" && (
              <AnimeEpisodesTab
                episodes={episodes}
                episodesLoading={episodesLoading}
                episodesPagination={episodesPagination}
                episodesPage={episodesPage}
                onPageChange={setEpisodesPage}
                formatEpisodeDate={formatEpisodeDate}
              />
            )}

            {/* Info Section */}
            <InfoSection
              icon={<FiInfo className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
              title="ANIME DETAILS"
              description="Find detailed information about your favorite anime, including synopsis, background, characters, episodes, and more. All data is provided by Jikan API."
              note="Data updated regularly from Jikan API"
            />
          </>
        )}
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
