"use client";

import { useState, useEffect, useCallback } from "react";
import { getTopAnime } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import PopularControls from "@/components/section/popular/PopularControls";
import PopularContent from "@/components/section/popular/PopularContent";
import { FiTrendingUp } from "react-icons/fi";

export default function PopularPage() {
  const [activeTab, setActiveTab] = useState("tv");
  const [activeFilter, setActiveFilter] = useState("bypopularity");
  const [activePage, setActivePage] = useState(1);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ambil data setiap kali filter/tab/page berubah
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getTopAnime(
          `filter=${activeFilter}&type=${activeTab}&limit=25&page=${activePage}`
        );
        if (cancelled) return;

        const dataSafe = Array.isArray(res?.data) ? res.data : [];
        const paginationSafe = res?.pagination ?? null;

        setData(dataSafe);
        setPagination(paginationSafe);
      } catch (err) {
        if (cancelled) return;
        console.error("Gagal memuat data:", err);
        setError(err?.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isClient, activeTab, activeFilter, activePage]);

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

  // Handler untuk perubahan tab
  const handleTabChange = (val) => {
    setActiveTab(val);
    setActivePage(1);
  };

  // Handler untuk perubahan filter
  const handleFilterChange = (val) => {
    setActiveFilter(val);
    setActivePage(1);
  };

  // Handler untuk reset filter
  const handleResetFilters = () => {
    setActiveTab("tv");
    setActiveFilter("bypopularity");
    setActivePage(1);
  };

  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 pt-15">
        {/* Header Section */}
        <PageHeader
          title="POPULAR ANIME"
          subtitle="Discover the most popular anime based on ratings and community favorites"
          icon={<FiTrendingUp className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <PopularControls
          activeTab={activeTab}
          activeFilter={activeFilter}
          activePage={activePage}
          totalItems={pagination?.items?.total ?? 0}
          onTabChange={handleTabChange}
          onFilterChange={handleFilterChange}
          onPageReset={() => setActivePage(1)}
        />

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            <PopularContent
              data={data}
              pagination={pagination}
              loading={loading}
              error={error}
              activePage={activePage}
              onPageChange={setActivePage}
              onResetFilters={handleResetFilters}
            />
          </div>
        </section>

        {/* Info Section */}
        <InfoSection
          icon={
            <FiTrendingUp className="text-[#FFBD69] text-3xl mx-auto mb-4" />
          }
          title="POPULARITY RANKINGS"
          description="Rankings are based on user ratings, popularity scores, and community engagement. Discover new favorites and see what's trending in the anime community."
          note="Data updated regularly from Jikan API"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
