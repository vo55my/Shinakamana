"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import Dropdown from "@/components/Dropdown";
import Pagination from "@/components/Pagination";
import { getSchedules } from "@/lib/api";
import { FiCalendar, FiClock, FiTv } from "react-icons/fi";

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

// Filter hanya anime dengan jadwal tayang valid
function filterByBroadcast(animeList) {
  if (!Array.isArray(animeList)) return [];
  return animeList.filter(
    (anime) =>
      anime.broadcast?.string &&
      anime.broadcast.string.toLowerCase() !== "unknown"
  );
}

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("monday");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data dari API
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;
    async function fetchData(day, pageNumber = 1) {
      try {
        setLoading(true);
        setError(null);

        const result = await getSchedules(
          `unapproved&filter=${day}&page=${pageNumber}&limit=25&sfw=true`
        );

        if (cancelled) return;

        const dataSafe = Array.isArray(result?.data) ? result.data : [];
        setData(dataSafe);
        setPagination(result?.pagination ?? null);
        setPage(pageNumber);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch schedule:", err);
          setError(err.message || "Failed to load schedule data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData(selectedDay, 1);

    return () => {
      cancelled = true;
    };
  }, [isClient, selectedDay]);

  // Info jumlah data
  const uniqueData = uniqueByMalId(filterByBroadcast(data));
  const perPage = pagination?.items?.per_page ?? 25;
  const startIndex = (page - 1) * perPage + 1;
  const endIndex = startIndex + uniqueData.length - 1;
  const totalItems = pagination?.items?.total ?? 0;

  // Day mapping untuk display
  const dayMap = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

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
                  ANIME SCHEDULE
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                Track your favorite anime airing schedule and never miss an
                episode
              </p>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Day Selector */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center space-x-3">
                  <FiCalendar className="text-[#FFBD69] text-xl" />
                  <span className="text-white font-semibold text-lg">
                    {dayMap[selectedDay]}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <FiTv className="text-[#FF6363] text-lg" />
                  <Dropdown
                    label="SELECT DAY"
                    options={[
                      { value: "monday", label: "Monday" },
                      { value: "tuesday", label: "Tuesday" },
                      { value: "wednesday", label: "Wednesday" },
                      { value: "thursday", label: "Thursday" },
                      { value: "friday", label: "Friday" },
                      { value: "saturday", label: "Saturday" },
                      { value: "sunday", label: "Sunday" },
                    ]}
                    value={selectedDay}
                    onChange={(val) => {
                      setSelectedDay(val);
                      setPage(1);
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
                  Airing on {dayMap[selectedDay]}
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
                  Please try refreshing the page or select a different day
                </p>
              </div>
            ) : uniqueData.length === 0 ? (
              <div className="text-center py-12">
                <FiClock className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                <div className="text-white/60 text-lg mb-4">
                  No anime scheduled for {dayMap[selectedDay]}.
                </div>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  Try selecting a different day or check back later for updates.
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
              <FiCalendar className="text-[#FFBD69] text-3xl mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">
                WEEKLY SCHEDULE
              </h3>
              <p className="text-white/70 mb-6">
                Stay updated with the latest anime airing schedule. All times
                are shown in Japan Standard Time (JST) and updated regularly.
              </p>
              <div className="text-white/40 text-sm">
                Schedule data provided by Jikan API • Times in JST
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
