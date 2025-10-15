"use client";

import { useState, useEffect, useCallback } from "react";
import { playlistHelpers } from "@/lib/playlistHelpers";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AnimeCard from "@/components/cards/AnimeCard";
import StatsCard from "@/components/cards/StatsCard";
import EmptyState from "@/components/common/EmptyState";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import {
  FiTrash2,
  FiPlay,
  FiFolder,
  FiClock,
  FiStar,
  FiUsers,
} from "react-icons/fi";

export default function PlaylistPage() {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

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

  if (loading) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 py-20">
        {/* Header Section */}
        <PageHeader
          title="MY PLAYLIST"
          subtitle="Your personal collection of favorite anime"
          icon={<FiFolder className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Stats Section */}
        {playlist.length > 0 && (
          <section className="py-8 bg-[#0f0f1f]">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <StatsCard
                  icon={
                    <FiFolder className="text-[#FF6363] text-2xl mx-auto mb-2" />
                  }
                  value={stats.total}
                  label="Total Anime"
                  color="#FF6363"
                />
                <StatsCard
                  icon={
                    <FiClock className="text-[#FFBD69] text-2xl mx-auto mb-2" />
                  }
                  value={stats.totalEpisodes}
                  label="Total Episodes"
                  color="#FFBD69"
                />
                <StatsCard
                  icon={
                    <FiStar className="text-[#543864] text-2xl mx-auto mb-2" />
                  }
                  value={stats.averageScore}
                  label="Avg Score"
                  color="#543864"
                />
                <StatsCard
                  icon={
                    <FiUsers className="text-[#FF6363] text-2xl mx-auto mb-2" />
                  }
                  value={`${(stats.totalMembers / 1000000).toFixed(1)}M`}
                  label="Total Members"
                  color="#FF6363"
                />
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
              <EmptyState
                icon={
                  <FiFolder className="text-[#FFBD69] text-6xl mx-auto mb-6 opacity-50" />
                }
                title="Your playlist is empty"
                description="Start building your personal anime collection by adding shows you want to watch or have enjoyed."
                actions={
                  <>
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
                  </>
                }
              />
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
              </>
            )}
          </div>
        </section>

        {/* Info Section */}
        <InfoSection
          icon={<FiFolder className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
          title="YOUR PLAYLIST"
          description="Build your personal anime collection by adding shows you want to watch or have enjoyed. Manage your favorites and keep track of your anime journey."
          note="Playlist data stored locally • Private to your device"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        anime={selectedAnime}
        onConfirm={removeFromPlaylist}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
