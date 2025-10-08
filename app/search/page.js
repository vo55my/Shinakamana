"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Dropdown from "@/components/Dropdown";
import Search from "@/components/Search";
import { useState, useEffect } from "react";
import { getAnimeGenres } from "@/lib/api";
import { useRouter } from "next/navigation";
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

  if (!isClient) {
    // SSR fallback untuk mencegah hydration error
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
                  ADVANCED SEARCH
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                Find your favorite anime with detailed filters and search
                options
              </p>
            </div>
          </div>
        </section>

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
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-gradient-to-r from-[#543864] to-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <FiSearch className="text-[#FFBD69] text-3xl mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">
                ADVANCED SEARCH
              </h3>
              <p className="text-white/70 mb-6">
                Use our advanced search filters to find exactly what you&apos;re
                looking for. Search by title, filter by type, status, rating,
                genres, and airing dates to discover your next favorite anime.
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
