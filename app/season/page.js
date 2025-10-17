"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSeasonNow, getSeasonUpcoming } from "@/lib/api";
import { uniqueByMalId } from "@/lib/uniqueHelpers";
import { filterByBroadcast } from "@/lib/broadcastHelpers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AnimeCard from "@/components/cards/AnimeCard";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/state/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import SeasonControls from "@/components/section/season/SeasonControls";
import { FiStar, FiCalendar } from "react-icons/fi";

export default function SeasonContent() {
  const router = useRouter();

  const [activeSeason, setActiveSeason] = useState("now"); // now | upcoming
  const [activeType, setActiveType] = useState("tv"); // tv | movie
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Untuk pencarian manual season/year
  const [season, setSeason] = useState("winter");
  const [year, setYear] = useState(new Date().getFullYear());

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data berdasarkan season/type/page
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        let result;
        const query = `continuing&filter=${activeType}&page=${page}`;

        if (activeSeason === "now") {
          result = await getSeasonNow(query);
        } else {
          result = await getSeasonUpcoming(query);
        }

        if (cancelled) return;

        const dataSafe = Array.isArray(result?.data) ? result.data : [];
        const paginationSafe = result?.pagination ?? null;

        setData(dataSafe);
        setPagination(paginationSafe);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch season data:", err);
          setError(err.message || "Failed to load data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isClient, activeSeason, activeType, page]);

  // Hitung info jumlah data
  const filteredData = uniqueByMalId(filterByBroadcast(data, activeType));
  const perPage = pagination?.items?.per_page ?? 20;
  const startIndex = (page - 1) * perPage + 1;
  const endIndex = startIndex + filteredData.length - 1;
  const totalItems = pagination?.items?.total ?? filteredData.length;

  // Handle tombol cari manual season/year
  const handleSearchSeason = () => {
    if (!year || isNaN(year)) {
      alert("Please enter a valid year!");
      return;
    }
    router.push(`/season/result?season=${season}&year=${year}`);
  };

  // Handle filter changes
  const handleTypeChange = (val) => {
    setActiveType(val);
    setPage(1);
  };

  const handleSeasonChange = (val) => {
    setActiveSeason(val);
    setPage(1);
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

  // SSR fallback untuk menghindari hydration error
  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  // Render states
  const renderContent = () => {
    // Loading state
    if (loading) {
      return (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <AnimeCard key={i} loading />
            ))}
          </div>
        </>
      );
    }

    // Error state
    if (error) {
      return (
        <>
          <EmptyState
            icon={
              <FiCalendar className="text-[#FF6363] text-4xl mx-auto mb-4" />
            }
            title={error}
            description="Please try refreshing the page or adjusting your filters"
          />
        </>
      );
    }

    // Empty state
    if (filteredData.length === 0) {
      return (
        <>
          <EmptyState
            icon={
              <FiCalendar className="text-[#FFBD69] text-4xl mx-auto mb-4" />
            }
            title="No anime found for the selected season and filters."
            description="Try adjusting your filters or search for a different season."
          />
        </>
      );
    }

    // Success state - menampilkan grid anime
    return (
      <>
        {/* Anime Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredData.map((anime) => (
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
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 pt-15">
        {/* Header Section */}
        <PageHeader
          title="ANIME SEASON"
          subtitle="Discover currently airing and upcoming anime seasons"
          icon={<FiStar className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <SeasonControls
          activeType={activeType}
          activeSeason={activeSeason}
          onTypeChange={handleTypeChange}
          onSeasonChange={handleSeasonChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          season={season}
          year={year}
          onSeasonSelect={setSeason}
          onYearChange={setYear}
          onSearchSeason={handleSearchSeason}
        />

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            {renderContent()}
          </div>
        </section>

        <InfoSection
          icon={<FiStar className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
          title="SEASONAL ANIME"
          description="Anime seasons are typically divided into four quarters: Winter (January-March), Spring (April-June), Summer (July-September), and Fall (October-December). Stay updated with the latest seasonal releases."
          note="Seasonal data provided by Jikan API • Updated regularly"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
