"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTopAnime } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import RankCard from "@/components/cards/RankCard";
import Dropdown from "@/components/common/Dropdown";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ResultInfo from "@/components/info/ResultInfo";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import { FiTrendingUp, FiFilter, FiPlay } from "react-icons/fi";

// helper: filter data duplikat berdasarkan mal_id
function uniqueByMalId(animeList) {
  if (!Array.isArray(animeList)) return [];
  const seen = new Set();
  return animeList.filter((anime) => {
    if (!anime?.mal_id || seen.has(anime.mal_id)) return false;
    seen.add(anime.mal_id);
    return true;
  });
}

export default function PopularPage() {
  const router = useRouter();
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

  // Hitung info jumlah data
  const uniqueData = uniqueByMalId(data);
  const perPage = pagination?.items?.per_page ?? 25;
  const startIndex = (activePage - 1) * perPage + 1;
  const endIndex = startIndex + uniqueData.length - 1;
  const totalItems = pagination?.items?.total ?? 0;

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

  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 py-20">
        {/* Header Section */}
        <PageHeader
          title="POPULAR ANIME"
          subtitle="Discover the most popular anime based on ratings and community favorites"
          icon={<FiTrendingUp className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Dropdown Filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-3">
                  <FiPlay className="text-[#FFBD69] text-lg" />
                  <Dropdown
                    label="TYPE"
                    options={[
                      { value: "tv", label: "TV Series" },
                      { value: "movie", label: "Movies" },
                    ]}
                    value={activeTab}
                    onChange={(val) => {
                      setActiveTab(val);
                      setActivePage(1);
                    }}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <FiFilter className="text-[#FF6363] text-lg" />
                  <Dropdown
                    label="FILTER"
                    options={[
                      { value: "bypopularity", label: "Most Popular" },
                      { value: "airing", label: "Currently Airing" },
                      { value: "upcoming", label: "Upcoming" },
                      { value: "favorite", label: "Most Favorited" },
                    ]}
                    value={activeFilter}
                    onChange={(val) => {
                      setActiveFilter(val);
                      setActivePage(1);
                    }}
                  />
                </div>
              </div>

              {/* Results Info */}
              <ResultInfo
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                extra={
                  "Sorted by " +
                  (activeFilter === "bypopularity"
                    ? "popularity"
                    : activeFilter)
                }
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 10 }).map((_, i) => (
                  <RankCard key={i} loading index={i} page={1} perPage={25} />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                icon={
                  <FiTrendingUp className="text-[#FF6363] text-4xl mx-auto mb-4" />
                }
                title={error}
                description="Please try refreshing the page"
              />
            ) : uniqueData.length === 0 ? (
              <EmptyState
                icon={
                  <FiTrendingUp className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                }
                title="No anime found matching your criteria."
                description=""
                actions={
                  <button
                    onClick={() => {
                      setActiveTab("tv");
                      setActiveFilter("bypopularity");
                      setActivePage(1);
                    }}
                    className="bg-[#FF6363] hover:bg-[#FF6363]/90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 border-2 border-[#FFBD69]"
                  >
                    Reset Filters
                  </button>
                }
              />
            ) : (
              <>
                {/* Rank Cards Grid */}
                <div className="space-y-4">
                  {uniqueData.map((anime, i) => (
                    <RankCard
                      key={anime.mal_id}
                      anime={anime}
                      index={i}
                      page={activePage}
                      perPage={25}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_visible_page > 1 && (
                  <div className="flex justify-center mt-12">
                    <Pagination
                      currentPage={activePage}
                      totalPages={Math.min(
                        4,
                        pagination.last_visible_page ?? 1
                      )}
                      onPageChange={setActivePage}
                      loading={loading}
                    />
                  </div>
                )}
              </>
            )}
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
