"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getAnimeSearch } from "@/lib/api";
import { uniqueByMalId } from "@/lib/uniqueHelpers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import ActiveFilters from "@/components/section/search/ActiveFilters";
import SearchResultsGrid from "@/components/section/search/SearchResultsGrid";
import ResultInfo from "@/components/info/ResultInfo";
import { FiSearch } from "react-icons/fi";

export default function SearchResultContent() {
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
  }, [isClient, searchParams]);

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

      <main className="flex-1 pt-15">
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
              <ActiveFilters searchQuery={searchQuery} />

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
            <SearchResultsGrid
              searchQuery={searchQuery}
              data={uniqueData}
              pagination={pagination}
              loading={loading}
              error={error}
              page={page}
              onPageChange={setPage}
            />
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
