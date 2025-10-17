"use client";

import Image from "next/image";
import InfoRow from "./InfoRow";
import AnimeStatsGrid from "./AnimeStatsGrid";
import { FiPlay, FiCalendar, FiCheck, FiPlus } from "react-icons/fi";

export default function AnimeInfoTab({
  anime,
  relations,
  isInPlaylist,
  isPlaylistLoading,
  onAddToPlaylist,
}) {
  return (
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
                  onClick={onAddToPlaylist}
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
                    <span className="text-lg">{anime.title_english}</span>
                  )}
                  {anime.title_japanese && (
                    <span className="text-sm">({anime.title_japanese})</span>
                  )}
                  {anime.year && (
                    <span className="text-[#FFBD69] font-semibold">
                      ({anime.year})
                    </span>
                  )}
                </div>

                <AnimeStatsGrid anime={anime} />
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
                <h4 className="text-[#FFBD69] font-bold text-lg">BASIC INFO</h4>
                <InfoRow label="Type" value={anime.type} />
                <InfoRow label="Source" value={anime.source} />
                <InfoRow label="Status" value={anime.status} />
                <InfoRow label="Duration" value={anime.duration} />
                <InfoRow label="Rating" value={anime.rating} />
              </div>

              {/* Broadcast Info */}
              <div className="space-y-3">
                <h4 className="text-[#FFBD69] font-bold text-lg">BROADCAST</h4>
                <InfoRow label="Aired" value={anime.aired?.string} />
                <InfoRow label="Broadcast" value={anime.broadcast?.string} />
                <InfoRow label="Season" value={anime.season} />
                <InfoRow label="Year" value={anime.year} />
              </div>

              {/* Production */}
              <div className="space-y-3">
                <h4 className="text-[#FFBD69] font-bold text-lg">PRODUCTION</h4>
                <InfoRow
                  label="Studios"
                  value={anime.studios?.map((s) => s.name).join(", ")}
                />
                <InfoRow
                  label="Producers"
                  value={anime.producers?.map((p) => p.name).join(", ")}
                />
                <InfoRow
                  label="Licensors"
                  value={anime.licensors?.map((l) => l.name).join(", ")}
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
                        {(rel.entry || []).map((e) => e.name).join(", ")}
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
  );
}
