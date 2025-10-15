"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { getSeason } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AnimeCard from "@/components/cards/AnimeCard";
import Dropdown from "@/components/common/Dropdown";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ResultInfo from "@/components/info/ResultInfo";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import ResultLoading from "@/components/common/ResultLoading";
import { FiCalendar, FiPlay, FiFilter } from "react-icons/fi";

// Helper: hapus duplikat berdasarkan mal_id
function uniqueByMalId(animeList) {
  if (!Array.isArray(animeList)) return [];
  const seen = new Set();
  return animeList.filter((anime) => {
    if (!anime?.mal_id || seen.has(anime.mal_id)) return false;
    seen.add(anime.mal_id);
    return true;
  });
}

// Helper: filter broadcast
function filterByBroadcast(animeList, filterType = "tv") {
  if (!Array.isArray(animeList)) return [];
  if (filterType === "movie") return animeList;
  return animeList.filter((anime) => {
    const b = anime?.broadcast;
    if (!b?.string) return false;
    const str = String(b.string).trim().toLowerCase();
    if (!str || str === "unknown") return false;
    if (b.timezone === null) return false;
    return true;
  });
}

// Komponen utama yang menggunakan useSearchParams
function SeasonResultContent() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // Ambil parameter hanya setelah client mount
  const [params, setParams] = useState({ year: "", season: "", filter: "tv" });

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showScroll, setShowScroll] = useState(false);

  // Hindari hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ambil parameter setelah client siap
  useEffect(() => {
    if (!isClient) return;

    const yearParam = searchParams.get("year") || "";
    const seasonParam = searchParams.get("season") || "";
    const filterParam = searchParams.get("filter") || "tv";

    setParams({ year: yearParam, season: seasonParam, filter: filterParam });
  }, [isClient, searchParams]);

  // Fetch data dari API
  useEffect(() => {
    if (!isClient || !params.year || !params.season) return;

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const query = `filter=${params.filter}&page=${page}`;
        const result = await getSeason(params.year, params.season, query);

        if (cancelled) return;

        const safeData = Array.isArray(result?.data) ? result.data : [];
        const safePagination = result?.pagination ?? null;

        setData(safeData);
        setPagination(safePagination);
      } catch (err) {
        if (!cancelled) {
          console.error("getSeason error:", err);
          setError(err?.message || "Failed to load data");
          setData([]);
          setPagination(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [isClient, params, page]);

  const filtered = uniqueByMalId(filterByBroadcast(data, params.filter));
  const perPage = pagination?.items?.per_page ?? 20;
  const totalItems = pagination?.items?.total ?? filtered.length;
  const startIndex = pagination ? (page - 1) * perPage + 1 : 0;
  const endIndex = pagination
    ? startIndex + filtered.length - 1
    : filtered.length;

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

  // SSR fallback (hindari hydration mismatch)
  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  if (!params.year || !params.season) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-24">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-white">
            Season Results
          </h1>
          <p className="text-center text-white/60">
            <b>Year</b> and <b>season</b> parameters are required.
          </p>
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
        <PageHeader
          title="SEASON RESULTS"
          subtitle={`${params.season} ${params.year} Anime Season`}
          icon={<FiCalendar className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              {/* Main Filters */}
              <div className="flex flex-wrap sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-3">
                  <FiPlay className="text-[#FFBD69] text-lg" />
                  <Dropdown
                    label="TYPE"
                    options={[
                      { value: "tv", label: "TV Series" },
                      { value: "movie", label: "Movies" },
                    ]}
                    value={params.filter}
                    onChange={(val) => {
                      setParams((prev) => ({ ...prev, filter: val }));
                      setPage(1);
                    }}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <FiFilter className="text-[#FF6363] text-lg" />
                  <div className="px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white rounded-xl min-w-[140px]">
                    <div className="capitalize font-semibold">
                      {params.season} {params.year}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Info */}
              <ResultInfo
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                extra={`${params.season} ${
                  params.year
                } • ${params.filter.toUpperCase()} Series`}
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
                {Array.from({ length: 10 }).map((_, i) => (
                  <AnimeCard key={i} loading />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                icon={
                  <FiCalendar className="text-[#FF6363] text-4xl mx-auto mb-4" />
                }
                title={error}
                description="Please try refreshing the page or adjusting your filters"
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={
                  <FiCalendar className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                }
                title={`No anime found for ${params.season} ${params.year}.`}
                description="Try searching for a different season or year."
              />
            ) : (
              <>
                {/* Anime Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                  {filtered.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_visible_page > 1 && (
                  <div className="flex justify-center mt-12">
                    <Pagination
                      currentPage={page}
                      totalPages={pagination.last_visible_page}
                      onPageChange={setPage}
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
          icon={<FiCalendar className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
          title="SEASONAL ANIME"
          description="Anime seasons are typically divided into four quarters: Winter (January-March), Spring (April-June), Summer (July-September), and Fall (October-December). Stay updated with the latest seasonal releases."
          note="Seasonal data provided by Jikan API • Updated regularly"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}

// Komponen utama dengan Suspense boundary
export default function SeasonResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading
          title="SEASON RESULTS"
          icon={<FiPlay className="text-[#FF6363] text-lg" />}
        />
      }
    >
      <SeasonResultContent />
    </Suspense>
  );
}
