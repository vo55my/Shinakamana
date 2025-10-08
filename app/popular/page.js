"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RankCard from "@/components/RankCard";
import Dropdown from "@/components/Dropdown";
import Pagination from "@/components/Pagination";
import { getTopAnime } from "@/lib/api";
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
                  POPULAR ANIME
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                Discover the most popular anime based on ratings and community
                favorites
              </p>
            </div>
          </div>
        </section>

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
                  Sorted by{" "}
                  {activeFilter === "bypopularity"
                    ? "popularity"
                    : activeFilter}
                </div>
              </div>
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
              <div className="text-center py-12">
                <div className="text-[#FF6363] text-lg font-semibold mb-2">
                  {error}
                </div>
                <p className="text-white/60">Please try refreshing the page</p>
              </div>
            ) : uniqueData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/60 text-lg mb-4">
                  No anime found matching your criteria.
                </div>
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
              </div>
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
        <section className="py-12 bg-gradient-to-r from-[#543864] to-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <FiTrendingUp className="text-[#FFBD69] text-3xl mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">
                POPULARITY RANKINGS
              </h3>
              <p className="text-white/70 mb-6">
                Rankings are based on user ratings, popularity scores, and
                community engagement. Discover new favorites and see what&apos;s
                trending in the anime community.
              </p>
              <div className="text-white/40 text-sm">
                Data updated regularly from Jikan API
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
