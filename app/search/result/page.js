"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import Pagination from "@/components/Pagination";
import { getAnimeSearch } from "@/lib/api";
import { FiSearch, FiFilter } from "react-icons/fi";

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

  // Loading SSR fallback (untuk hindari hydration error)
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
                  SEARCH RESULTS
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                {searchQuery.q
                  ? `Search results for "${searchQuery.q}"`
                  : "Filtered anime results"}
              </p>
            </div>
          </div>
        </section>

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
                  Page {page} of {pagination?.last_visible_page ?? 1}
                </div>
              </div>
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
              <div className="text-center py-12">
                <FiSearch className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                <div className="text-white/60 text-lg mb-4">
                  Please enter keywords or filters to search for anime.
                </div>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  Use the search page to find your favorite anime with detailed
                  filters.
                </p>
              </div>
            ) : loading ? (
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
                  Please try refreshing the page or adjusting your search
                  filters
                </p>
              </div>
            ) : uniqueData.length === 0 ? (
              <div className="text-center py-12">
                <FiSearch className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                <div className="text-white/60 text-lg mb-4">
                  No anime found with the specified criteria.
                </div>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  Try adjusting your search filters or using different keywords.
                </p>
              </div>
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
        <section className="py-12 bg-gradient-to-r from-[#543864] to-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <FiSearch className="text-[#FFBD69] text-3xl mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">
                SEARCH RESULTS
              </h3>
              <p className="text-white/70 mb-6">
                Found exactly what you&apos;re looking for? Browse through our
                comprehensive anime database to discover new series, movies, and
                hidden gems based on your specific preferences and filters.
              </p>
              <div className="text-white/40 text-sm">
                Search powered by Jikan API • Comprehensive anime database
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
function SearchResultLoading() {
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
                  SEARCH RESULTS
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
              <div className="flex items-center space-x-3">
                <FiFilter className="text-[#FF6363] text-lg" />
                <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-4 w-64">
                  <div className="h-4 bg-[#543864]/50 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-[#543864]/50 rounded w-20 animate-pulse"></div>
                    <div className="h-6 bg-[#543864]/50 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="h-12 bg-[#543864]/50 rounded-xl animate-pulse w-48"></div>
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
      </main>
      <Footer />
    </div>
  );
}

// Komponen utama dengan Suspense boundary
export default function ResultPage() {
  return (
    <Suspense fallback={<SearchResultLoading />}>
      <SearchResultContent />
    </Suspense>
  );
}
