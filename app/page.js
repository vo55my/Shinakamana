"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSeasonNow, getTopAnime } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Search from "@/components/common/Search";
import AnimeCard from "@/components/cards/AnimeCard";
import SectionHeader from "@/components/anime/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import LoadingSkeleton from "@/components/anime/LoadingSkeleton";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import { FiCalendar, FiTrendingUp, FiArrowRight, FiInfo } from "react-icons/fi";

export default function Home() {
  const router = useRouter();

  // Cegah hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // State untuk anime sedang tayang
  const [airingAnime, setAiringAnime] = useState([]);
  const [airingLoading, setAiringLoading] = useState(true);
  const [airingError, setAiringError] = useState(null);

  // State untuk anime terpopuler
  const [popularAnime, setPopularAnime] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState(null);

  const [showScroll, setShowScroll] = useState(false);

  // Hydration guard
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch anime yang sedang tayang
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;

    async function fetchAiringAnime() {
      try {
        setAiringLoading(true);
        setAiringError(null);

        const result = await getSeasonNow("limit=5");
        if (cancelled) return;
        setAiringAnime(Array.isArray(result?.data) ? result.data : []);
      } catch (err) {
        console.error("Error fetching airing anime:", err);
        setAiringError("Gagal memuat anime yang sedang tayang");
      } finally {
        if (!cancelled) setAiringLoading(false);
      }
    }

    fetchAiringAnime();
    return () => {
      cancelled = true;
    };
  }, [isClient]);

  // Fetch anime terpopuler
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;

    async function fetchPopularAnime() {
      try {
        setPopularLoading(true);
        setPopularError(null);

        const result = await getTopAnime("limit=5");
        if (cancelled) return;
        setPopularAnime(Array.isArray(result?.data) ? result.data : []);
      } catch (err) {
        console.error("Error fetching popular anime:", err);
        setPopularError("Gagal memuat anime terpopuler");
      } finally {
        if (!cancelled) setPopularLoading(false);
      }
    }

    fetchPopularAnime();
    return () => {
      cancelled = true;
    };
  }, [isClient]);

  const handleSearch = (query) => {
    if (query && query.trim() !== "") {
      router.push(`/search/result?q=${encodeURIComponent(query)}`);
    }
  };

  const navigateToSection = (section) => {
    router.push(`/${section}`);
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

  // SSR fallback sementara
  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1">
        {/* Section 1 - Hero Jumbotron */}
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2f] to-[#0f0f1f] text-white overflow-hidden px-4 sm:px-6">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF6363]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFBD69]/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#543864]/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative text-center w-full max-w-4xl z-10 px-4 sm:px-6">
            {/* Main heading */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <h1
                  id="brand"
                  className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-[#FF6363]"
                >
                  SHINAKAMANA
                </h1>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 font-light px-2">
                Discover and explore{" "}
                <span className="text-[#FFBD69] font-semibold">anime</span> with
                comprehensive information
              </p>
            </div>
            {/* Search bar */}
            <div className="w-full max-w-2xl mx-auto mb-12 px-2 sm:px-0">
              <Search onSearch={handleSearch} />
            </div>
          </div>
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-[#FFBD69] rounded-full flex justify-center">
              <div className="w-1 h-3 bg-[#FFBD69] rounded-full mt-2"></div>
            </div>
          </div>
        </section>

        {/* Section 2 - Sedang Tayang */}
        <section id="airing" className="py-16 sm:py-20 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[#0f0f1f]"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section header dengan aksi */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-12">
              <SectionHeader
                icon={
                  <FiCalendar className="text-[#FFBD69] text-lg sm:text-xl" />
                }
                title="CURRENTLY AIRING"
                subtitle="Anime currently airing this season"
                color="#FF6363"
              />
              <button
                onClick={() => navigateToSection("season")}
                className="group flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#1a1a2f] border border-[#543864] hover:border-[#FF6363] text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-[#FF6363] hover:scale-105 text-sm sm:text-base"
              >
                <span>VIEW ALL</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            {/* Anime cards grid */}
            <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 md:grid md:grid-cols-5 md:gap-4 sm:gap-6 md:overflow-visible md:space-x-0 scrollbar-hide">
              {airingLoading ? (
                <LoadingSkeleton count={5} type="card" />
              ) : airingError ? (
                <EmptyState
                  icon={
                    <FiCalendar className="text-[#FF6363] text-4xl mx-auto mb-4" />
                  }
                  title={airingError}
                  description="Please try refreshing the page"
                />
              ) : airingAnime.length === 0 ? (
                <EmptyState
                  icon={
                    <FiCalendar className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                  }
                  title="No currently airing anime found."
                  description=""
                />
              ) : (
                airingAnime
                  .slice(0, 5)
                  .map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))
              )}
            </div>
          </div>
        </section>

        {/* Section 3 - Anime Terpopuler */}
        <section id="popular" className="py-16 sm:py-20 relative">
          {/* Background */}
          <div className="absolute inset-0 bg-[#1a1a2f]"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-12">
              <SectionHeader
                icon={
                  <FiTrendingUp className="text-[#FF6363] text-lg sm:text-xl" />
                }
                title="POPULAR ANIME"
                subtitle="Top anime based on ratings and popularity"
                color="#FFBD69"
              />
              <button
                onClick={() => navigateToSection("popular")}
                className="group flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#1a1a2f] border border-[#543864] hover:border-[#FFBD69] text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-[#FFBD69] hover:text-[#0f0f1f] hover:scale-105 text-sm sm:text-base"
              >
                <span>VIEW ALL</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            {/* Anime cards grid */}
            <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 md:grid md:grid-cols-5 md:gap-4 sm:gap-6 md:overflow-visible md:space-x-0 scrollbar-hide">
              {popularLoading ? (
                <LoadingSkeleton count={5} type="card" />
              ) : popularError ? (
                <EmptyState
                  icon={
                    <FiTrendingUp className="text-[#FF6363] text-4xl mx-auto mb-4" />
                  }
                  title={popularError}
                  description="Please try refreshing the page"
                />
              ) : popularAnime.length === 0 ? (
                <EmptyState
                  icon={
                    <FiTrendingUp className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                  }
                  title="No popular anime found."
                  description=""
                />
              ) : (
                popularAnime
                  .slice(0, 5)
                  .map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <InfoSection
          icon={
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF6363] to-[#FFBD69] rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-2xl">
              <FiInfo className="text-white text-xl sm:text-2xl" />
            </div>
          }
          title="EXPLORE ANIME UNIVERSE"
          description="Dive into the world of anime with detailed information, character profiles, episode guides, and much more."
          note={
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6">
              <button
                onClick={() => navigateToSection("search")}
                className="bg-[#FF6363] hover:bg-[#FF6363]/90 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 border-2 border-[#FFBD69] shadow-lg hover:shadow-[#FF6363]/25 text-sm sm:text-base"
              >
                SEARCH ANIME
              </button>
              <button
                onClick={() => navigateToSection("schedule")}
                className="bg-transparent hover:bg-[#FFBD69] text-white hover:text-[#0f0f1f] font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 border-2 border-[#FFBD69] text-sm sm:text-base"
              >
                VIEW SCHEDULE
              </button>
            </div>
          }
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
