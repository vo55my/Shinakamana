"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import Pagination from "@/components/Pagination";
import Dropdown from "@/components/Dropdown";
import { getAnimeSearch, getAnimeGenres } from "@/lib/api";
import { FiTag } from "react-icons/fi";

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

export default function GenreResultPage() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // State untuk data dan filter
  const [genreId, setGenreId] = useState("");
  const [genreName, setGenreName] = useState("");
  const [allGenres, setAllGenres] = useState([]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Format genres untuk dropdown
  const genreOptions = allGenres.map((genre) => ({
    value: genre.mal_id.toString(),
    label: genre.name,
  }));

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ambil parameter dari URL
  useEffect(() => {
    if (!isClient) return;

    const params = new URLSearchParams(window.location.search);
    const genreParam = params.get("genres") || "";
    setGenreId(genreParam);
  }, [isClient]);

  // Fetch semua genres untuk dropdown
  useEffect(() => {
    if (!isClient) return;

    async function fetchAllGenres() {
      try {
        const result = await getAnimeGenres();
        const data = result?.data ?? [];
        setAllGenres(data);

        // Set genre name berdasarkan ID
        if (genreId) {
          const foundGenre = data.find((g) => g.mal_id.toString() === genreId);
          if (foundGenre) {
            setGenreName(foundGenre.name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    }

    fetchAllGenres();
  }, [isClient, genreId]);

  // Fetch data anime berdasarkan genre
  useEffect(() => {
    if (!isClient || !genreId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("genres", genreId);
        params.append("page", page.toString());
        params.append("limit", "25");
        params.append("order_by", "members");
        params.append("sort", "desc");

        const result = await getAnimeSearch(params.toString());
        const safeData = Array.isArray(result?.data) ? result.data : [];
        setData(safeData);
        setPagination(result?.pagination ?? null);

        // Update genre name jika belum ada
        if (!genreName && safeData.length > 0) {
          const firstAnime = safeData[0];
          if (firstAnime.genres) {
            const foundGenre = firstAnime.genres.find(
              (g) => g.mal_id.toString() === genreId
            );
            if (foundGenre) {
              setGenreName(foundGenre.name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load genre results:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isClient, genreId, page, genreName]);

  // Handle genre change dari dropdown
  const handleGenreChange = (selectedGenreId) => {
    const selectedGenre = allGenres.find(
      (g) => g.mal_id.toString() === selectedGenreId
    );
    if (selectedGenre) {
      setGenreId(selectedGenreId);
      setGenreName(selectedGenre.name);
      setPage(1);
      // Update URL tanpa reload page
      const params = new URLSearchParams();
      params.append("genres", selectedGenreId);
      window.history.pushState({}, "", `/genre/result?${params.toString()}`);
    }
  };

  // Hitung info jumlah data
  const uniqueData = uniqueByMalId(data);
  const perPage = pagination?.items?.per_page ?? 25;
  const startIndex = (page - 1) * perPage + 1;
  const endIndex = startIndex + uniqueData.length - 1;
  const totalItems = pagination?.items?.total ?? 0;

  // Loading SSR fallback
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
                  GENRE RESULTS
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                {genreName
                  ? `Anime in ${genreName} genre`
                  : "Browse anime by genre"}
              </p>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              {/* Genre Filter Dropdown */}
              <div className="flex items-center space-x-3">
                <FiTag className="text-[#FF6363] text-lg flex-shrink-0" />
                <Dropdown
                  label="Select Genre"
                  options={genreOptions}
                  value={genreId}
                  onChange={handleGenreChange}
                />
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
                  {genreName ? `${genreName} Genre` : "All genres"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Kondisi tanpa genre */}
            {!genreId ? (
              <div className="text-center py-12">
                <FiTag className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                <div className="text-white/60 text-lg mb-4">
                  Please select a genre to browse anime
                </div>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  Use the genre dropdown above to explore anime by different
                  genres and categories.
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
                  Please try refreshing the page or selecting a different genre
                </p>
              </div>
            ) : uniqueData.length === 0 ? (
              <div className="text-center py-12">
                <FiTag className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                <div className="text-white/60 text-lg mb-4">
                  No anime found in {genreName} genre
                </div>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  Try selecting a different genre or check back later for new
                  additions.
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
              <FiTag className="text-[#FFBD69] text-3xl mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">
                GENRE BROWSING
              </h3>
              <p className="text-white/70 mb-6">
                Explore anime organized by specific genres. From action-packed
                adventures to heartwarming romances, discover new series that
                match your preferences and find your next favorite anime.
              </p>
              <div className="text-white/40 text-sm">
                Genre data provided by Jikan API • Updated regularly
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
