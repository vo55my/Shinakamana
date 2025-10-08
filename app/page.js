"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Search from "@/components/Search";
import AnimeCard from "@/components/AnimeCard";
import { getSeasonNow, getTopAnime } from "@/lib/api";
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

  // SSR fallback sementara
  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-white text-lg">Loading...</div>
        </main>
        <Footer />
      </div>
    );
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
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 md:mb-0">
                <div className="w-2 h-8 sm:h-12 bg-[#FF6363] rounded-full"></div>{" "}
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white flex items-center space-x-2 sm:space-x-3">
                    <FiCalendar className="text-[#FFBD69] text-lg sm:text-xl" />{" "}
                    <span>CURRENTLY AIRING</span>
                  </h2>
                  <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">
                    Anime currently airing this season
                  </p>
                </div>
              </div>
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
                Array.from({ length: 5 }).map((_, i) => (
                  <AnimeCard key={i} loading />
                ))
              ) : airingError ? (
                <div className="col-span-5 text-center py-8 sm:py-12">
                  <div className="text-[#FF6363] text-base sm:text-lg font-semibold mb-2">
                    {airingError}
                  </div>
                  <p className="text-white/60 text-sm sm:text-base">
                    Please try refreshing the page
                  </p>
                </div>
              ) : airingAnime.length === 0 ? (
                <div className="col-span-5 text-center py-8 sm:py-12">
                  <div className="text-white/60 text-base sm:text-lg">
                    No currently airing anime found.
                  </div>
                </div>
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
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 md:mb-0">
                <div className="w-2 h-8 sm:h-12 bg-[#FFBD69] rounded-full"></div>
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white flex items-center space-x-2 sm:space-x-3">
                    <FiTrendingUp className="text-[#FF6363] text-lg sm:text-xl" />
                    <span>POPULAR ANIME</span>
                  </h2>
                  <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">
                    Top anime based on ratings and popularity
                  </p>
                </div>
              </div>
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
                Array.from({ length: 5 }).map((_, i) => (
                  <AnimeCard key={i} loading />
                ))
              ) : popularError ? (
                <div className="col-span-5 text-center py-8 sm:py-12">
                  <div className="text-[#FF6363] text-base sm:text-lg font-semibold mb-2">
                    {popularError}
                  </div>
                  <p className="text-white/60 text-sm sm:text-base">
                    Please try refreshing the page
                  </p>
                </div>
              ) : popularAnime.length === 0 ? (
                <div className="col-span-5 text-center py-8 sm:py-12">
                  <div className="text-white/60 text-base sm:text-lg">
                    No popular anime found.
                  </div>
                </div>
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

        {/* CTA Section */}
        <section id="explore" className="py-16 sm:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#543864] to-[#1a1a2f]"></div>
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF6363] to-[#FFBD69] rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-2xl">
                <FiInfo className="text-white text-xl sm:text-2xl" />
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4">
                EXPLORE ANIME UNIVERSE
              </h3>
              <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg px-2">
                Dive into the world of anime with detailed information,
                character profiles, episode guides, and much more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
