"use client";

import { useState, useEffect, useCallback } from "react";
import { getAnimeGenres } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Dropdown from "@/components/common/Dropdown";
import Search from "@/components/common/Search";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiStar,
  FiTag,
  FiPlay,
} from "react-icons/fi";

export default function SearchPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [genres, setGenres] = useState([]);
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
    setKeyword(params.get("q") || "");
    setType(params.get("type") || "");
    setStatus(params.get("status") || "");
    setRating(params.get("rating") || "");
    setStartDate(params.get("start_date") || "");
    setEndDate(params.get("end_date") || "");
    setGenreInclude(params.get("genres") || "");
    setGenreExclude(params.get("genres_exclude") || "");
  }, [isClient]);

  // Fetch genres aman
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;
    async function fetchGenres() {
      try {
        const res = await getAnimeGenres();
        const data = res?.data;

        let combined = [];
        if (Array.isArray(data)) {
          combined = data;
        } else if (typeof data === "object") {
          // Gabungkan semua kategori genre menjadi satu array
          combined = [
            ...(data.genres ?? []),
            ...(data.explicit_genres ?? []),
            ...(data.themes ?? []),
            ...(data.demographics ?? []),
          ];
        }

        if (!cancelled) setGenres(combined);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
        if (!cancelled) setGenres([]);
      }
    }

    fetchGenres();
    return () => {
      cancelled = true;
    };
  }, [isClient]);

  const handleSearch = (q = keyword) => {
    if (!isClient) return;

    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (type) params.append("type", type);
    if (status) params.append("status", status);
    if (rating) params.append("rating", rating);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (genreInclude) params.append("genres", genreInclude);
    if (genreExclude) params.append("genres_exclude", genreExclude);

    if (!params.toString()) return;
    router.push(`/search/result?${params.toString()}`);
  };

  const isDisabled =
    !keyword &&
    !type &&
    !status &&
    !rating &&
    !startDate &&
    !endDate &&
    !genreInclude &&
    !genreExclude;

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

      <main className="flex-1 py-20">
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
              {/* Search Bar */}
              <div className="mb-8">
                <Search
                  initialValue={keyword}
                  onSearch={(q) => {
                    setKeyword(q);
                    handleSearch(q);
                  }}
                />
              </div>

              {/* Filters Grid */}
              <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <FiFilter className="text-[#FF6363] text-xl" />
                  <h3 className="text-white font-bold text-lg">FILTERS</h3>
                </div>

                <div className="space-y-6">
                  {/* Type & Status Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <FiPlay className="text-[#FFBD69] text-lg" />
                      <Dropdown
                        label="TYPE"
                        options={[
                          { value: "", label: "All Types" },
                          { value: "tv", label: "TV Series" },
                          { value: "movie", label: "Movies" },
                          { value: "ova", label: "OVA" },
                          { value: "ona", label: "ONA" },
                          { value: "special", label: "Special" },
                        ]}
                        value={type}
                        onChange={setType}
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiCalendar className="text-[#FF6363] text-lg" />
                      <Dropdown
                        label="STATUS"
                        options={[
                          { value: "", label: "All Status" },
                          { value: "airing", label: "Currently Airing" },
                          { value: "complete", label: "Completed" },
                          { value: "upcoming", label: "Upcoming" },
                        ]}
                        value={status}
                        onChange={setStatus}
                      />
                    </div>
                  </div>

                  {/* Rating Row */}
                  <div className="flex items-center space-x-3">
                    <FiStar className="text-[#FFBD69] text-lg" />
                    <Dropdown
                      label="RATING"
                      options={[
                        { value: "", label: "All Ratings" },
                        { value: "g", label: "G - All Ages" },
                        { value: "pg", label: "PG - Children" },
                        { value: "pg13", label: "PG-13 - Teens 13+" },
                        {
                          value: "r17",
                          label: "R - 17+ (violence & profanity)",
                        },
                        { value: "r", label: "R+ - Mild Nudity" },
                        { value: "rx", label: "Rx - Hentai" },
                      ]}
                      value={rating}
                      onChange={setRating}
                    />
                  </div>

                  {/* Genre Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <FiTag className="text-[#FF6363] text-lg" />
                      <Dropdown
                        label="INCLUDE GENRES"
                        options={[
                          { value: "", label: "All Genres" },
                          ...genres.map((g) => ({
                            value: g.mal_id?.toString() ?? "",
                            label: g.name ?? "Unknown",
                          })),
                        ]}
                        value={genreInclude}
                        onChange={setGenreInclude}
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiTag className="text-[#FFBD69] text-lg" />
                      <Dropdown
                        label="EXCLUDE GENRES"
                        options={[
                          { value: "", label: "No Exclusions" },
                          ...genres.map((g) => ({
                            value: g.mal_id?.toString() ?? "",
                            label: g.name ?? "Unknown",
                          })),
                        ]}
                        value={genreExclude}
                        onChange={setGenreExclude}
                      />
                    </div>
                  </div>

                  {/* Date Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label className="text-white/70 text-sm font-medium uppercase">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white rounded-xl focus:outline-none focus:border-[#FF6363]"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-white/70 text-sm font-medium uppercase">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white rounded-xl focus:outline-none focus:border-[#FF6363]"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={() => handleSearch()}
                    disabled={isDisabled}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-4 font-bold rounded-xl transition-all duration-300 border-2 ${
                      isDisabled
                        ? "bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-[#0f0f1f] border-transparent hover:scale-105"
                    }`}
                  >
                    <FiSearch size={20} />
                    <span>SEARCH ANIME</span>
                  </button>
                  {isDisabled && (
                    <EmptyState
                      icon={
                        <FiSearch className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                      }
                      title="Please enter keywords or filters to search for anime."
                      description="Use the filters above to find your favorite anime with detailed options."
                    />
                  )}
                </div>
              </div>
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
