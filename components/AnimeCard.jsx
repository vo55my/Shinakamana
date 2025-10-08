"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiStar, FiEye, FiClock, FiPlus, FiCheck } from "react-icons/fi";
import { playlistHelpers } from "@/lib/playlistHelpers";

export default function AnimeCard({ anime, loading = false }) {
  const [imgError, setImgError] = useState(false);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);

  // Check initial playlist state dengan async
  useEffect(() => {
    const checkPlaylistStatus = async () => {
      if (anime?.mal_id) {
        try {
          const inPlaylist = await playlistHelpers.isInPlaylist(anime.mal_id);
          setIsInPlaylist(inPlaylist);
        } catch (error) {
          console.error("Error checking playlist status:", error);
        }
      }
    };

    checkPlaylistStatus();
  }, [anime]);

  // Handle add to playlist dengan async
  const handleAddToPlaylist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaylistLoading || !anime) return;

    setIsPlaylistLoading(true);

    try {
      if (isInPlaylist) {
        // Remove from playlist
        const success = await playlistHelpers.removeFromPlaylist(anime.mal_id);
        if (success) {
          setIsInPlaylist(false);
          console.log("Removed from playlist:", anime.title);
        } else {
          console.warn("Failed to remove from playlist");
        }
      } else {
        // Add to playlist
        const success = await playlistHelpers.addToPlaylist(anime);
        if (success) {
          setIsInPlaylist(true);
          console.log("Added to playlist:", anime.title);
        } else {
          console.warn(
            "Failed to add to playlist - storage might be full or item already exists"
          );
        }
      }
    } catch (error) {
      console.error("Playlist operation failed:", error);
    } finally {
      setIsPlaylistLoading(false);
    }
  };

  // Placeholder saat loading
  if (loading) {
    return (
      <div className="group bg-[#1a1a2f] border border-[#543864] rounded-xl overflow-hidden animate-pulse">
        <div className="aspect-[3/4] bg-[#543864]/50 relative">
          <div className="absolute bottom-3 left-3 w-16 h-6 bg-[#543864]/70 rounded-full"></div>
          <div className="absolute top-3 right-3 w-12 h-6 bg-[#543864]/70 rounded-full"></div>
          <div className="absolute top-3 left-3 w-8 h-8 bg-[#543864]/70 rounded-full"></div>
        </div>
        <div className="p-4 space-y-3">
          <div className="h-5 bg-[#543864]/50 rounded w-4/5"></div>
          <div className="h-4 bg-[#543864]/50 rounded w-1/2"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-[#543864]/50 rounded w-12"></div>
            <div className="h-4 bg-[#543864]/50 rounded w-12"></div>
          </div>
        </div>
      </div>
    );
  }

  // Validasi data anime
  if (!anime) {
    return (
      <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-6 text-center text-white/60 text-sm">
        Data anime tidak tersedia
      </div>
    );
  }

  const {
    mal_id,
    images,
    title = "Untitled",
    type = "N/A",
    episodes,
    score,
    genres = [],
    members,
  } = anime || {};

  // Pastikan image aman (fallback local image)
  const imgSrc =
    !imgError && images?.jpg?.image_url
      ? images.jpg.image_url
      : "/no-image.jpg";

  return (
    <Link
      href={`/anime/${mal_id}`}
      aria-label={`View details for ${title}`}
      prefetch={false}
      className="block group"
    >
      <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl overflow-hidden hover:border-[#FF6363] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6363]/20 relative">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 160px, 240px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
            priority={false}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1f] via-transparent to-transparent opacity-70"></div>

          {/* Score Badge - Responsive positioning */}
          {score && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-[#FF6363] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
              <FiStar className="text-[#FFBD69] text-xs md:text-sm" />
              <span className="text-xs">{score}</span>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-[#543864]/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
            {type}
          </div>

          {/* Add to Playlist Button - Responsive positioning */}
          <button
            onClick={handleAddToPlaylist}
            disabled={isPlaylistLoading}
            className={`absolute top-2 left-2 md:top-3 md:left-3 p-1.5 md:p-2 rounded-full backdrop-blur-sm border transition-all duration-300 ${
              isInPlaylist
                ? "bg-[#FF6363] border-[#FF6363] text-white"
                : "bg-[#1a1a2f]/80 border-[#543864] text-[#FFBD69] hover:bg-[#FF6363] hover:border-[#FF6363] hover:text-white"
            } ${
              isPlaylistLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            aria-label={
              isInPlaylist ? "Remove from playlist" : "Add to playlist"
            }
          >
            {isPlaylistLoading ? (
              <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isInPlaylist ? (
              <FiCheck className="text-xs md:text-sm" />
            ) : (
              <FiPlus className="text-xs md:text-sm" />
            )}
          </button>

          {/* Playlist Status Indicator */}
          {isInPlaylist && !isPlaylistLoading && (
            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3">
              <div className="bg-[#FF6363] text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <FiCheck className="text-xs" />
                <span className="text-xs">In Playlist</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          {/* Title */}
          <h3
            className="text-white font-bold text-sm mb-2 md:mb-3 line-clamp-2 group-hover:text-[#FFBD69] transition-colors duration-300 leading-tight"
            title={title}
          >
            {title}
          </h3>

          {/* Info Stats */}
          <div className="flex items-center justify-between text-white/60 text-xs">
            {/* Episodes */}
            <div className="flex items-center space-x-1">
              <FiClock className="text-[#FF6363] text-xs" />
              <span className="text-xs">{episodes ?? "?"} EP</span>
            </div>

            {/* Members */}
            {members && (
              <div className="flex items-center space-x-1">
                <FiEye className="text-[#FFBD69] text-xs" />
                <span className="text-xs">{(members / 1000).toFixed(0)}K</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {Array.isArray(genres) && genres.length > 0 && (
            <div className="mt-2 md:mt-3 flex flex-wrap gap-1">
              {genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="px-1.5 py-0.5 md:px-2 md:py-1 bg-[#543864]/50 border border-[#543864] rounded text-white/70 text-xs"
                >
                  {genre.name}
                </span>
              ))}
              {genres.length > 2 && (
                <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-[#543864]/30 border border-[#543864] rounded text-white/50 text-xs">
                  +{genres.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar (Optional - for ongoing series) */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-[#543864]">
          <div
            className="h-full bg-gradient-to-r from-[#FF6363] to-[#FFBD69] transition-all duration-500"
            style={{ width: episodes ? "100%" : "0%" }}
          ></div>
        </div>
      </div>
    </Link>
  );
}
