"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Search from "@/components/common/Search";
import PageHeader from "@/components/common/PageHeader";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import SearchFilters from "@/components/section/search/SearchFilters";
import { FiSearch } from "react-icons/fi";

export default function SearchPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState(""); // State terpisah untuk input search
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [genreInclude, setGenreInclude] = useState("");
  const [genreExclude, setGenreExclude] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ambil nilai parameter dari URL (client-side only)
  useEffect(() => {
    if (!isClient) return;

    const params = new URLSearchParams(window.location.search);
    const urlKeyword = params.get("q") || "";
    setKeyword(urlKeyword);
    setSearchInput(urlKeyword); // Juga set searchInput
    setType(params.get("type") || "");
    setStatus(params.get("status") || "");
    setRating(params.get("rating") || "");
    setStartDate(params.get("start_date") || "");
    setEndDate(params.get("end_date") || "");
    setGenreInclude(params.get("genres") || "");
    setGenreExclude(params.get("genres_exclude") || "");
  }, [isClient]);

  const handleSearch = (searchKeyword = searchInput) => {
    if (!isClient) return;

    const params = new URLSearchParams();

    // SELALU masukkan searchInput ke parameter jika ada
    if (searchKeyword && searchKeyword.trim()) {
      params.append("q", searchKeyword.trim());
    }

    // Parameter filter lainnya
    if (type) params.append("type", type);
    if (status) params.append("status", status);
    if (rating) params.append("rating", rating);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (genreInclude) params.append("genres", genreInclude);
    if (genreExclude) params.append("genres_exclude", genreExclude);

    // PERUBAHAN: Biarkan search tetap berjalan meskipun hanya ada filter
    // Jika ada setidaknya satu parameter (keyword atau filter), lakukan search
    if (params.toString() !== "") {
      router.push(`/search/result?${params.toString()}`);
    }
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

  if (!isClient) {
    // SSR fallback untuk mencegah hydration error
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 pt-15">
        {/* Header Section */}
        <PageHeader
          title="SEARCH ANIME"
          subtitle="Find your favorite anime with detailed filters and search options"
          icon={<FiSearch className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Search Section */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Search Bar - Sekarang langsung trigger search dengan semua filter */}
              <Search
                initialValue={searchInput}
                onSearch={handleSearch} // Langsung trigger search dengan semua filter
              />

              {/* Filters Component - Tanpa tombol search */}
              <SearchFilters
                keyword={searchInput}
                type={type}
                status={status}
                rating={rating}
                startDate={startDate}
                endDate={endDate}
                genreInclude={genreInclude}
                genreExclude={genreExclude}
                onTypeChange={setType}
                onStatusChange={setStatus}
                onRatingChange={setRating}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onGenreIncludeChange={setGenreInclude}
                onGenreExcludeChange={setGenreExclude}
                // onSearch prop dihapus karena tidak ada tombol lagi
              />
            </div>
          </div>
        </section>

        {/* Info Section */}
        <InfoSection
          icon={<FiSearch className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
          title="SEARCH ANIME"
          description="Use our advanced search filters to find exactly what you're looking for. Search by title, filter by type, status, rating, genres, and airing dates to discover your next favorite anime."
          note="Search powered by Jikan API • Comprehensive anime database"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
