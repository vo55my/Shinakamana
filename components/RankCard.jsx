"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiStar, FiEye, FiClock, FiPlus, FiCheck } from "react-icons/fi";
import { playlistHelpers } from "@/lib/playlistHelpers";

export default function RankCard({
  anime,
  index = 0,
  page = 1,
  perPage = 20,
  loading = false,
}) {
  const [isClient, setIsClient] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);

  // Hindari mismatch antara SSR & CSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check initial playlist state dengan async
  useEffect(() => {
    const checkPlaylistStatus = async () => {
      if (isClient && anime?.mal_id) {
        try {
          const inPlaylist = await playlistHelpers.isInPlaylist(anime.mal_id);
          setIsInPlaylist(inPlaylist);
        } catch (error) {
          console.error("Error checking playlist status:", error);
        }
      }
    };

    checkPlaylistStatus();
  }, [isClient, anime]);

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

  if (!isClient) {
    // Fallback untuk server-side render agar tidak menyebabkan hydration error
    return (
      <div className="flex items-center bg-[#1a1a2f] border border-[#543864] rounded-xl h-28 sm:h-32 overflow-hidden animate-pulse">
        <div className="w-16 h-full bg-[#543864]/50 flex items-center justify-center text-white/40"></div>
        <div className="w-20 sm:w-24 h-full bg-[#543864]/50" />
        <div className="p-4 flex-1 space-y-2">
          <div className="h-5 bg-[#543864]/50 rounded w-3/4"></div>
          <div className="h-4 bg-[#543864]/50 rounded w-1/2"></div>
          <div className="h-4 bg-[#543864]/50 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center bg-[#1a1a2f] border border-[#543864] rounded-xl h-28 sm:h-32 overflow-hidden animate-pulse">
        <div className="w-16 h-full bg-[#543864]/50 flex items-center justify-center text-white/40"></div>
        <div className="w-20 sm:w-24 h-full bg-[#543864]/50" />
        <div className="p-4 flex-1 space-y-2">
          <div className="h-5 bg-[#543864]/50 rounded w-3/4"></div>
          <div className="h-4 bg-[#543864]/50 rounded w-1/2"></div>
          <div className="h-4 bg-[#543864]/50 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Perhitungan rank di client agar tidak bentrok antara SSR dan CSR
  const rank = (page - 1) * perPage + (index + 1);
  const { mal_id, images, title, type, episodes, score, genres, members } =
    anime || {};
  const imgSrc =
    !imgError && images?.jpg?.image_url
      ? images.jpg.image_url
      : "/no-image.jpg";

  return (
    <Link
      href={`/anime/${mal_id}`}
      aria-label={`View details for ${title}`}
      className="block group"
      prefetch={false}
    >
      <div className="flex items-center bg-[#1a1a2f] border border-[#543864] rounded-xl hover:border-[#FF6363] transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#FF6363]/10 overflow-hidden h-28 sm:h-32 relative">
        {/* Rank Number */}
        <div
          className={`flex items-center justify-center w-16 h-full font-bold text-lg sm:text-xl transition-colors duration-300 ${
            rank <= 3
              ? "bg-gradient-to-b from-[#FF6363] to-[#FFBD69] text-[#0f0f1f]"
              : "bg-[#543864] text-white"
          }`}
        >
          #{rank}
        </div>

        {/* Image Container */}
        <div className="relative w-20 sm:w-24 h-full flex-shrink-0">
          <Image
            src={imgSrc}
            alt={title || "Anime image"}
            fill
            sizes="96px"
            className="object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1f] via-transparent to-transparent opacity-60"></div>

          {/* Add to Playlist Button */}
          <button
            onClick={handleAddToPlaylist}
            disabled={isPlaylistLoading}
            className={`absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-sm border transition-all duration-300 ${
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
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isInPlaylist ? (
              <FiCheck className="text-xs" />
            ) : (
              <FiPlus className="text-xs" />
            )}
          </button>

          {/* Playlist Status Badge */}
          {isInPlaylist && !isPlaylistLoading && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-[#FF6363] text-white text-xs px-1.5 py-0.5 rounded-full">
                <FiCheck className="inline mr-1" />
                <span className="text-xs">Saved</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden">
          {/* Title */}
          <h3 className="text-white font-bold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-[#FFBD69] transition-colors duration-300">
            {title}
          </h3>

          {/* Info Stats */}
          <div className="flex items-center space-x-4 mb-2">
            {/* Score */}
            {score && (
              <div className="flex items-center space-x-1 text-white/80">
                <FiStar className="text-[#FFBD69] text-xs" />
                <span className="text-xs">{score}</span>
              </div>
            )}

            {/* Episodes */}
            <div className="flex items-center space-x-1 text-white/80">
              <FiClock className="text-[#FF6363] text-xs" />
              <span className="text-xs">{episodes ?? "?"} EP</span>
            </div>

            {/* Members */}
            {members && (
              <div className="flex items-center space-x-1 text-white/80">
                <FiEye className="text-[#543864] text-xs" />
                <span className="text-xs">{(members / 1000).toFixed(0)}K</span>
              </div>
            )}
          </div>

          {/* Type & Genres */}
          <div className="flex items-center space-x-2">
            {/* Type Badge */}
            {type && (
              <span className="px-2 py-1 bg-[#543864] border border-[#543864] rounded text-white/70 text-xs">
                {type}
              </span>
            )}

            {/* Genres */}
            {genres?.length > 0 && (
              <span className="text-white/60 text-xs truncate">
                {genres
                  .slice(0, 2)
                  .map((g) => g.name)
                  .join(", ")}
                {genres.length > 2 && ` +${genres.length - 2}`}
              </span>
            )}
          </div>

          {/* Playlist Status Text (for mobile) */}
          {isInPlaylist && (
            <div className="mt-2">
              <span className="text-[#FF6363] text-xs font-semibold flex items-center">
                <FiCheck className="mr-1" />
                In Your Playlist
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar (Optional) */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#543864]">
          <div
            className="h-full bg-gradient-to-r from-[#FF6363] to-[#FFBD69] transition-all duration-500"
            style={{ width: episodes ? "100%" : "0%" }}
          ></div>
        </div>
      </div>
    </Link>
  );
}
