"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { getAnimeSearch } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AnimeCard from "@/components/cards/AnimeCard";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ResultInfo from "@/components/info/ResultInfo";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import { FiSearch, FiFilter } from "react-icons/fi";
import ResultLoading from "@/components/common/ResultLoading";

// Hapus duplikat berdasarkan mal_id
function uniqueByMalId(animeList) {
  if (!Array.isArray(animeList)) return [];
  const seen = new Set();
  return animeList.filter((anime) => {
    if (!anime?.mal_id || seen.has(anime.mal_id)) return false;
    seen.add(anime.mal_id);
    return true;
  });
}

// Komponen utama yang menggunakan useSearchParams
function SearchResultContent() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Default state untuk query dan hasil
  const [searchQuery, setSearchQuery] = useState({
    q: "",
    type: "",
    status: "",
    rating: "",
    genres: "",
    genres_exclude: "",
    start_date: "",
    end_date: "",
  });
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ambil parameter pencarian dari URL (client-side only)
  useEffect(() => {
    if (!isClient) return;

    const params = new URLSearchParams(window.location.search);
    setSearchQuery({
      q: params.get("q") || "",
      type: params.get("type") || "",
      status: params.get("status") || "",
      rating: params.get("rating") || "",
      genres: params.get("genres") || "",
      genres_exclude: params.get("genres_exclude") || "",
      start_date: params.get("start_date") || "",
      end_date: params.get("end_date") || "",
    });
  }, [isClient, searchParams]); // Tambahkan searchParams sebagai dependency

  // Fetch data berdasarkan parameter dan halaman
  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      const {
        q,
        type,
        status,
        rating,
        genres,
        genres_exclude,
        start_date,
        end_date,
      } = searchQuery;

      // Jangan fetch jika semua kosong
      if (
        !q &&
        !type &&
        !status &&
        !rating &&
        !genres &&
        !genres_exclude &&
        !start_date &&
        !end_date
      ) {
        setData([]);
        setPagination(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (q) params.append("q", q);
        if (type) params.append("type", type);
        if (status) params.append("status", status);
        if (rating) params.append("rating", rating);
        if (genres) params.append("genres", genres);
        if (genres_exclude) params.append("genres_exclude", genres_exclude);
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);
        params.append("page", page.toString());

        const result = await getAnimeSearch(params.toString());
        const safeData = Array.isArray(result?.data) ? result.data : [];
        setData(safeData);
        setPagination(result?.pagination ?? null);
      } catch (err) {
        console.error("Failed to load search results:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isClient, searchQuery, page]);

  // Hitung info jumlah data
  const uniqueData = uniqueByMalId(data);
  const perPage = pagination?.items?.per_page ?? 25;
  const startIndex = (page - 1) * perPage + 1;
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

  // Loading SSR fallback (untuk hindari hydration error)
  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 py-20">
        {/* Header Section */}
        <PageHeader
          title="SEARCH RESULTS"
          subtitle={
            searchQuery.q
              ? `Search results for "${searchQuery.q}"`
              : "Filtered anime results"
          }
          icon={<FiSearch className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              {/* Active Filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-3">
                  <FiFilter className="text-[#FF6363] text-lg" />
                  <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-4">
                    <div className="text-xs text-white/60 uppercase font-bold mb-2">
                      ACTIVE FILTERS
                    </div>
                    <div className="flex flex-wrap gap-2 uppercase">
                      {searchQuery.q && (
                        <span className="px-3 py-1 bg-[#FF6363] text-white text-sm rounded-full font-medium">
                          Keyword: {searchQuery.q}
                        </span>
                      )}
                      {searchQuery.type && (
                        <span className="px-3 py-1 bg-[#FFBD69] text-[#0f0f1f] text-sm rounded-full font-medium">
                          Type: {searchQuery.type}
                        </span>
                      )}
                      {searchQuery.status && (
                        <span className="px-3 py-1 bg-[#543864] text-white text-sm rounded-full font-medium">
                          Status: {searchQuery.status}
                        </span>
                      )}
                      {searchQuery.rating && (
                        <span className="px-3 py-1 bg-[#FF6363] text-white text-sm rounded-full font-medium">
                          Rating: {searchQuery.rating}
                        </span>
                      )}
                      {searchQuery.genres && (
                        <span className="px-3 py-1 bg-[#FFBD69] text-[#0f0f1f] text-sm rounded-full font-medium">
                          Genres: {searchQuery.genres}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Info */}
              <ResultInfo
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                extra={`Page ${page} of ${pagination?.last_visible_page ?? 1}`}
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Kondisi awal tanpa parameter */}
            {!searchQuery.q &&
            !searchQuery.type &&
            !searchQuery.status &&
            !searchQuery.rating &&
            !searchQuery.genres &&
            !searchQuery.genres_exclude &&
            !searchQuery.start_date &&
            !searchQuery.end_date ? (
              <EmptyState
                icon={
                  <FiSearch className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                }
                title="Please enter keywords or filters to search for anime."
                description="Use the search page to find your favorite anime with detailed filters."
              />
            ) : loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
                {Array.from({ length: 10 }).map((_, i) => (
                  <AnimeCard key={i} loading />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                icon={
                  <FiSearch className="text-[#FF6363] text-4xl mx-auto mb-4" />
                }
                title={error}
                description="Please try refreshing the page or adjusting your search filters"
              />
            ) : uniqueData.length === 0 ? (
              <EmptyState
                icon={
                  <FiSearch className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                }
                title="No anime found with the specified criteria."
                description="Try adjusting your search filters or using different keywords."
              />
            ) : (
              <>
                {/* Anime Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                  {uniqueData.map((anime) => (
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
          icon={<FiSearch className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
          title="SEARCH RESULTS"
          description="Found exactly what you're looking for? Browse through our comprehensive anime database to discover new series, movies, and hidden gems based on your specific preferences and filters."
          note="Search powered by Jikan API • Comprehensive anime database"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}

// Komponen utama dengan Suspense boundary
export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading
          title="SEARCH RESULTS"
          icon={<FiFilter className="text-[#FF6363] text-lg" />}
        />
      }
    >
      <SearchResultContent />
    </Suspense>
  );
}
