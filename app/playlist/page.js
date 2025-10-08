"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import {
  FiTrash2,
  FiPlay,
  FiFolder,
  FiClock,
  FiStar,
  FiUsers,
  FiX,
  FiDatabase,
} from "react-icons/fi";
import { playlistHelpers } from "@/lib/playlistHelpers";

export default function PlaylistPage() {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);

  // Load playlist dari composite storage
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const [playlistData, storageData] = await Promise.all([
          playlistHelpers.getPlaylist(),
          playlistHelpers.getStorageInfo(),
        ]);

        setPlaylist(playlistData);
        setStorageInfo(storageData);
      } catch (error) {
        console.error("Error loading playlist:", error);
        setPlaylist([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, []);

  // Hapus anime dari playlist
  const removeFromPlaylist = async (malId) => {
    const success = await playlistHelpers.removeFromPlaylist(malId);
    if (success) {
      setPlaylist((prev) => prev.filter((anime) => anime.mal_id !== malId));
    }
    setShowDeleteModal(false);
    setSelectedAnime(null);
  };

  // Hapus semua playlist
  const clearPlaylist = async () => {
    const success = await playlistHelpers.clearPlaylist();
    if (success) {
      setPlaylist([]);
    }
    setShowDeleteModal(false);
    setSelectedAnime(null);
  };

  // Buka modal konfirmasi hapus
  const confirmDelete = (anime) => {
    setSelectedAnime(anime);
    setShowDeleteModal(true);
  };

  // Hitung statistik
  const stats = {
    total: playlist.length,
    totalEpisodes: playlist.reduce(
      (sum, anime) => sum + (anime.episodes || 0),
      0
    ),
    averageScore:
      playlist.length > 0
        ? (
            playlist.reduce((sum, anime) => sum + (anime.score || 0), 0) /
            playlist.length
          ).toFixed(2)
        : 0,
    totalMembers: playlist.reduce(
      (sum, anime) => sum + (anime.members || 0),
      0
    ),
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-white text-lg">
            Loading playlist...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 py-20">
        {/* Header Section */}
        <section className="relative py-12 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-[#FF6363] rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                  MY PLAYLIST
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                Your personal collection of favorite anime
              </p>

              {/* Storage Info */}
              {storageInfo && (
                <div className="mt-4 flex items-center space-x-2 px-4 py-2 bg-[#543864]/50 border border-[#543864] rounded-lg">
                  <FiDatabase className="text-[#FFBD69]" />
                  <span className="text-white/80 text-sm">
                    Storage:{" "}
                    <strong className="text-[#FF6363]">
                      {storageInfo.active}
                    </strong>
                    {storageInfo.supported.length > 1 && (
                      <span className="text-white/60">
                        {" "}
                        (Backup: {storageInfo.supported.slice(1).join(", ")})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {playlist.length > 0 && (
          <section className="py-8 bg-[#0f0f1f]">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {/* Total Anime */}
                <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-4 text-center">
                  <FiFolder className="text-[#FF6363] text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stats.total}
                  </div>
                  <div className="text-white/60 text-sm">Total Anime</div>
                </div>

                {/* Total Episodes */}
                <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-4 text-center">
                  <FiClock className="text-[#FFBD69] text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stats.totalEpisodes}
                  </div>
                  <div className="text-white/60 text-sm">Total Episodes</div>
                </div>

                {/* Average Score */}
                <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-4 text-center">
                  <FiStar className="text-[#543864] text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stats.averageScore}
                  </div>
                  <div className="text-white/60 text-sm">Avg Score</div>
                </div>

                {/* Total Members */}
                <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-4 text-center">
                  <FiUsers className="text-[#FF6363] text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {(stats.totalMembers / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-white/60 text-sm">Total Members</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Playlist Content */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Header dengan Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black text-white mb-2">
                  Your Anime Collection
                </h2>
                <p className="text-white/60">
                  {playlist.length === 0
                    ? "Start building your anime playlist by adding shows you love"
                    : `You have ${playlist.length} anime in your playlist`}
                </p>
              </div>

              {playlist.length > 0 && (
                <div className="flex space-x-3">
                  <button
                    onClick={clearPlaylist}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#FF6363] text-white rounded-lg hover:bg-[#ff5252] transition-colors duration-300"
                  >
                    <FiTrash2 className="text-sm" />
                    <span>Clear All</span>
                  </button>
                </div>
              )}
            </div>

            {/* Empty State */}
            {playlist.length === 0 ? (
              <div className="text-center py-16">
                <FiFolder className="text-[#FFBD69] text-6xl mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold text-white/80 mb-4">
                  Your playlist is empty
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  Start building your personal anime collection by adding shows
                  you want to watch or have enjoyed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/genre"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FF6363] text-white rounded-lg hover:bg-[#ff5252] transition-colors duration-300"
                  >
                    <FiPlay className="text-sm" />
                    <span>Browse Genres</span>
                  </Link>
                  <Link
                    href="/top"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-[#543864] text-white rounded-lg hover:bg-[#4a3157] transition-colors duration-300"
                  >
                    <FiStar className="text-sm" />
                    <span>Explore Top Anime</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Anime Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                  {playlist.map((anime) => (
                    <div key={anime.mal_id} className="relative group">
                      <AnimeCard anime={anime} />

                      {/* Delete Button Overlay */}
                      <button
                        onClick={() => confirmDelete(anime)}
                        className="absolute top-2 right-2 z-10 p-2 bg-[#FF6363] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                        aria-label={`Remove ${anime.title} from playlist`}
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Playlist Info */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#543864] rounded-lg">
                    <FiDatabase className="text-[#FFBD69]" />
                    <span className="text-white/80 text-sm">
                      Playlist saved with Composite Storage (
                      {storageInfo?.active})
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAnime && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Remove from Playlist
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <p className="text-white/70 mb-6">
              Are you sure you want to remove{" "}
              <strong className="text-[#FFBD69]">{selectedAnime.title}</strong>{" "}
              from your playlist?
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => removeFromPlaylist(selectedAnime.mal_id)}
                className="flex-1 py-2 bg-[#FF6363] text-white rounded-lg hover:bg-[#ff5252] transition-colors duration-300"
              >
                Remove
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 bg-[#543864] text-white rounded-lg hover:bg-[#4a3157] transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
