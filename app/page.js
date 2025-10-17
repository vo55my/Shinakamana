"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSeasonNow, getTopAnime } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import HeroSection from "@/components/section/home/HeroSection";
import AiringSection from "@/components/section/home/AiringSection";
import PopularSection from "@/components/section/home/PopularSection";
import InfoSectionWithButtons from "@/components/section/home/InfoSectionWithButtons";

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
        <HeroSection onSearch={handleSearch} />

        {/* Section 2 - Sedang Tayang */}
        <AiringSection
          airingAnime={airingAnime}
          airingLoading={airingLoading}
          airingError={airingError}
          onViewAll={() => navigateToSection("season")}
        />

        {/* Section 3 - Anime Terpopuler */}
        <PopularSection
          popularAnime={popularAnime}
          popularLoading={popularLoading}
          popularError={popularError}
          onViewAll={() => navigateToSection("popular")}
        />

        {/* Info Section */}
        <InfoSectionWithButtons
          onSearch={() => navigateToSection("search")}
          onSchedule={() => navigateToSection("schedule")}
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
