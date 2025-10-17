"use client";

import { useState, useEffect, useCallback } from "react";
import { playlistHelpers } from "@/lib/playlistHelpers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import ClearAllConfirmationModal from "@/components/modals/ClearAllConfirmationModal";
import PlaylistEmptyState from "@/components/state/PlaylistEmptyState";
import PlaylistStats from "@/components/section/playlist/PlaylistStats";
import PlaylistHeader from "@/components/section/playlist/PlaylistHeader";
import PlaylistGrid from "@/components/section/playlist/PlaylistGrid";
import { FiFolder } from "react-icons/fi";

export default function PlaylistPage() {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Load playlist dari composite storage
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const playlistData = await playlistHelpers.getPlaylist();
        setPlaylist(playlistData);
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
    setShowClearAllModal(false);
    setSelectedAnime(null);
  };

  // Buka modal konfirmasi hapus
  const confirmDelete = (anime) => {
    setSelectedAnime(anime);
    setShowDeleteModal(true);
  };

  // Buka modal konfirmasi clear all
  const confirmClearAll = () => {
    setShowClearAllModal(true);
  };

  // Scroll button
  useEffect(() => {
    let rafId = null;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          setShowScroll(window.scrollY > 400);
          ticking = false;
        });
      }
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

      <main className="flex-1 pt-15">
        {/* Header Section */}
        <PageHeader
          title="MY PLAYLIST"
          subtitle="Your personal collection of favorite anime"
          icon={<FiFolder className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Stats Section */}
        <PlaylistStats playlist={playlist} />

        {/* Playlist Content */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Header dengan Actions */}
            <PlaylistHeader playlist={playlist} onClearAll={confirmClearAll} />

            {/* Content */}
            {playlist.length === 0 ? (
              <PlaylistEmptyState />
            ) : (
              <PlaylistGrid playlist={playlist} onDeleteAnime={confirmDelete} />
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

      {/* Clear All Confirmation Modal */}
      <ClearAllConfirmationModal
        open={showClearAllModal}
        playlistCount={playlist.length}
        onConfirm={clearPlaylist}
        onCancel={() => setShowClearAllModal(false)}
      />
    </div>
  );
}
