"use client";

import { useState, useEffect, useCallback } from "react";
import { getSchedules } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AnimeCard from "@/components/cards/AnimeCard";
import Dropdown from "@/components/common/Dropdown";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ResultInfo from "@/components/info/ResultInfo";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
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
  const [showScroll, setShowScroll] = useState(false);

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
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 py-20">
        {/* Header Section */}
        <PageHeader
          title="ANIME SCHEDULE"
          subtitle="Track your favorite anime airing schedule and never miss an episode"
          icon={<FiCalendar className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

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
              <ResultInfo
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                extra={`Airing on ${dayMap[selectedDay]}`}
              />
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
              <EmptyState
                icon={
                  <FiClock className="text-[#FF6363] text-4xl mx-auto mb-4" />
                }
                title={error}
                description="Please try refreshing the page or select a different day"
              />
            ) : uniqueData.length === 0 ? (
              <EmptyState
                icon={
                  <FiClock className="text-[#FFBD69] text-4xl mx-auto mb-4" />
                }
                title={`No anime scheduled for ${dayMap[selectedDay]}.`}
                description="Try selecting a different day or check back later for updates."
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
          icon={<FiCalendar className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
          title="WEEKLY SCHEDULE"
          description="Stay updated with the latest anime airing schedule. All times are shown in Japan Standard Time (JST) and updated regularly."
          note="Schedule data provided by Jikan API • Times in JST"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
