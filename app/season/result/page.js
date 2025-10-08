"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import Dropdown from "@/components/Dropdown";
import Pagination from "@/components/Pagination";
import { getSeason } from "@/lib/api";
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

  // SSR fallback (hindari hydration mismatch)
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
        <section className="relative py-12 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-[#FF6363] rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                  SEASON RESULTS
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl capitalize">
                {params.season} {params.year} Anime Season
              </p>
            </div>
          </div>
        </section>

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
                <div className="text-white/40 text-xs mt-1 capitalize">
                  {params.season} {params.year} • {params.filter.toUpperCase()}{" "}
                  Series
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
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                <div className="text-white/60 text-lg mb-4">
                  No anime found for {params.season} {params.year}.
                </div>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  Try searching for a different season or year.
                </p>
              </div>
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

// Loading component untuk Suspense
function SeasonResultLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />
      <main className="flex-1 py-20">
        {/* Header Loading */}
        <section className="relative py-12 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-[#FF6363] rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                  SEASON RESULTS
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <div className="h-6 bg-[#543864]/50 rounded w-64 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Controls Loading */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex flex-wrap sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-3">
                  <FiPlay className="text-[#FFBD69] text-lg" />
                  <div className="w-48 h-12 bg-[#543864]/50 rounded-xl animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiFilter className="text-[#FF6363] text-lg" />
                  <div className="w-40 h-12 bg-[#543864]/50 rounded-xl animate-pulse"></div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <div className="h-4 bg-[#543864]/50 rounded w-32 animate-pulse mb-2"></div>
                <div className="h-3 bg-[#543864]/50 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Loading */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
              {Array.from({ length: 10 }).map((_, i) => (
                <AnimeCard key={i} loading />
              ))}
            </div>
          </div>
        </section>

        {/* Info Section Loading */}
        <section className="py-12 bg-gradient-to-r from-[#543864] to-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="h-8 bg-[#543864]/50 rounded w-32 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-[#543864]/50 rounded w-48 mx-auto mb-4 animate-pulse"></div>
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-[#543864]/50 rounded animate-pulse"></div>
                <div className="h-4 bg-[#543864]/50 rounded animate-pulse"></div>
                <div className="h-4 bg-[#543864]/50 rounded w-3/4 mx-auto animate-pulse"></div>
              </div>
              <div className="h-3 bg-[#543864]/50 rounded w-64 mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Komponen utama dengan Suspense boundary
export default function SeasonResultPage() {
  return (
    <Suspense fallback={<SeasonResultLoading />}>
      <SeasonResultContent />
    </Suspense>
  );
}
