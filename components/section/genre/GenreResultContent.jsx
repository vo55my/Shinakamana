"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getAnimeSearch, getAnimeGenres } from "@/lib/api";
import { uniqueByMalId } from "@/lib/uniqueHelpers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import InfoSection from "@/components/info/InfoSection";
import GenreResultControls from "./GenreResultControls";
import GenreResultStates from "./GenreResultStates";
import { FiTag } from "react-icons/fi";

export default function GenreResultContent() {
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
  const [showScroll, setShowScroll] = useState(false);

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

    const genreParam = searchParams.get("genres") || "";
    setGenreId(genreParam);
  }, [isClient, searchParams]);

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

  // Loading SSR fallback
  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 pt-15">
        {/* Header Section */}
        <PageHeader
          title="GENRE RESULTS"
          subtitle={
            genreName ? `Anime in ${genreName} genre` : "Browse anime by genre"
          }
          icon={<FiTag className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <GenreResultControls
          genreId={genreId}
          genreName={genreName}
          genreOptions={genreOptions}
          onGenreChange={handleGenreChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            <GenreResultStates
              genreId={genreId}
              loading={loading}
              error={error}
              uniqueData={uniqueData}
              genreName={genreName}
              pagination={pagination}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </section>

        <InfoSection
          icon={<FiTag className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
          title="GENRE BROWSING"
          description="Explore anime organized by specific genres. From action-packed adventures to heartwarming romances, discover new series that match your preferences and find your next favorite anime."
          note="Genre data provided by Jikan API • Updated regularly"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
