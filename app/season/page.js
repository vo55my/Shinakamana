"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import Dropdown from "@/components/Dropdown";
import Pagination from "@/components/Pagination";
import { getSeasonNow, getSeasonUpcoming } from "@/lib/api";
import { FiCalendar, FiPlay, FiFilter, FiSearch } from "react-icons/fi";

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

  // SSR fallback untuk menghindari hydration error
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

      <main className="flex-1 py-20">
        {/* Header Section */}
        <section className="relative py-12 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-[#FF6363] rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                  ANIME SEASON
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                Discover currently airing and upcoming anime seasons
              </p>
            </div>
          </div>
        </section>

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
              <div className="text-center lg:text-right">
                <div className="text-white/70 text-sm font-medium">
                  Showing{" "}
                  <span className="text-[#FFBD69] font-bold">
                    {startIndex}-{endIndex}
                  </span>{" "}
                  of{" "}
                  <span className="text-[#FF6363] font-bold">{totalItems}</span>{" "}
                  anime
                </div>
                <div className="text-white/40 text-xs mt-1">
                  {activeSeason === "now" ? "Currently Airing" : "Upcoming"}{" "}
                  {activeType.toUpperCase()} Series
                </div>
              </div>
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
              <div className="text-center py-12">
                <div className="text-[#FF6363] text-lg font-semibold mb-2">
                  {error}
                </div>
                <p className="text-white/60">
                  Please try refreshing the page or adjusting your filters
                </p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                <div className="text-white/60 text-lg mb-4">
                  No anime found for the selected season and filters.
                </div>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  Try adjusting your filters or search for a different season.
                </p>
              </div>
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
        <section className="py-12 bg-gradient-to-r from-[#543864] to-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <FiCalendar className="text-[#FFBD69] text-3xl mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">
                SEASONAL ANIME
              </h3>
              <p className="text-white/70 mb-6">
                Anime seasons are typically divided into four quarters: Winter
                (January-March), Spring (April-June), Summer (July-September),
                and Fall (October-December). Stay updated with the latest
                seasonal releases.
              </p>
              <div className="text-white/40 text-sm">
                Seasonal data provided by Jikan API • Updated regularly
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
