"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSeasonNow, getSeasonUpcoming } from "@/lib/api";
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
import { FiStar, FiCalendar, FiPlay, FiFilter, FiSearch } from "react-icons/fi";

// helper: hapus duplikat berdasarkan mal_id
function uniqueByMalId(animeList) {
  if (!Array.isArray(animeList)) return [];
  const seen = new Set();
  return animeList.filter((anime) => {
    if (!anime?.mal_id || seen.has(anime.mal_id)) return false;
    seen.add(anime.mal_id);
    return true;
  });
}

// helper: filter broadcast
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

export default function SeasonPage() {
  const router = useRouter();

  const [activeSeason, setActiveSeason] = useState("now"); // now | upcoming
  const [activeType, setActiveType] = useState("tv"); // tv | movie
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Untuk pencarian manual season/year
  const [season, setSeason] = useState("winter");
  const [year, setYear] = useState(new Date().getFullYear());

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data berdasarkan season/type/page
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        let result;
        const query = `continuing&filter=${activeType}&page=${page}`;

        if (activeSeason === "now") {
          result = await getSeasonNow(query);
        } else {
          result = await getSeasonUpcoming(query);
        }

        if (cancelled) return;

        const dataSafe = Array.isArray(result?.data) ? result.data : [];
        const paginationSafe = result?.pagination ?? null;

        setData(dataSafe);
        setPagination(paginationSafe);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch season data:", err);
          setError(err.message || "Failed to load data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isClient, activeSeason, activeType, page]);

  // Hitung info jumlah data
  const filteredData = uniqueByMalId(filterByBroadcast(data, activeType));
  const perPage = pagination?.items?.per_page ?? 20;
  const startIndex = (page - 1) * perPage + 1;
  const endIndex = startIndex + filteredData.length - 1;
  const totalItems = pagination?.items?.total ?? filteredData.length;

  // Handle tombol cari manual season/year
  const handleSearchSeason = () => {
    if (!year || isNaN(year)) {
      alert("Please enter a valid year!");
      return;
    }
    router.push(`/season/result?season=${season}&year=${year}`);
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

  // SSR fallback untuk menghindari hydration error
  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 py-20">
        {/* Header Section */}
        <PageHeader
          title="ANIME SEASON"
          subtitle="Discover currently airing and upcoming anime seasons"
          icon={<FiStar className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              {/* Main Filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-3">
                  <FiPlay className="text-[#FFBD69] text-lg" />
                  <Dropdown
                    label="TYPE"
                    options={[
                      { value: "tv", label: "TV Series" },
                      { value: "movie", label: "Movies" },
                    ]}
                    value={activeType}
                    onChange={(val) => {
                      setActiveType(val);
                      setPage(1);
                    }}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <FiFilter className="text-[#FF6363] text-lg" />
                  <Dropdown
                    label="SEASON"
                    options={[
                      { value: "now", label: "Currently Airing" },
                      { value: "upcoming", label: "Upcoming" },
                    ]}
                    value={activeSeason}
                    onChange={(val) => {
                      setActiveSeason(val);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Results Info */}
              <ResultInfo
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                extra={`${
                  activeSeason === "now" ? "Currently Airing" : "Upcoming"
                } ${activeType.toUpperCase()} Series`}
              />
            </div>

            {/* Manual Season Search */}
            <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <FiCalendar className="text-[#FFBD69] text-xl" />
                  <h3 className="text-white font-bold text-lg">
                    SEARCH SPECIFIC SEASON
                  </h3>
                </div>

                <div className="flex flex-wrap sm:flex-row gap-3">
                  <div className="flex items-center space-x-3">
                    <Dropdown
                      label="SEASON"
                      options={[
                        { value: "winter", label: "Winter" },
                        { value: "spring", label: "Spring" },
                        { value: "summer", label: "Summer" },
                        { value: "fall", label: "Fall" },
                      ]}
                      value={season}
                      onChange={setSeason}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="1917"
                      max={new Date().getFullYear() + 1}
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white rounded-xl focus:outline-none focus:border-[#FF6363] placeholder-white/40 w-32"
                      placeholder="Year"
                    />
                  </div>

                  <button
                    onClick={handleSearchSeason}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-[#0f0f1f] font-bold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-transparent"
                  >
                    <FiSearch size={18} />
                    <span>SEARCH</span>
                  </button>
                </div>
              </div>
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
            ) : filteredData.length === 0 ? (
              <EmptyState
                icon={
                  <FiCalendar className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                }
                title="No anime found for the selected season and filters."
                description="Try adjusting your filters or search for a different season."
              />
            ) : (
              <>
                {/* Anime Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                  {filteredData.map((anime) => (
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
          icon={<FiStar className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
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
