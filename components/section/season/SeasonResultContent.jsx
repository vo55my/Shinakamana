"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getSeason } from "@/lib/api";
import { uniqueByMalId } from "@/lib/uniqueHelpers";
import { filterByBroadcast } from "@/lib/broadcastHelpers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import InfoSection from "@/components/info/InfoSection";
import SeasonResultControls from "./SeasonResultControls";
import SeasonResultStates from "./SeasonResultStates";
import { FiCalendar } from "react-icons/fi";

export default function SeasonResultContent() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // Ambil parameter hanya setelah client mount
  const [params, setParams] = useState({ year: "", season: "", filter: "tv" });

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  // Hindari hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ambil parameter setelah client siap
  useEffect(() => {
    if (!isClient) return;

    const yearParam = searchParams.get("year") || "";
    const seasonParam = searchParams.get("season") || "";
    const filterParam = searchParams.get("filter") || "tv";

    setParams({ year: yearParam, season: seasonParam, filter: filterParam });
  }, [isClient, searchParams]);

  // Fetch data dari API
  useEffect(() => {
    if (!isClient || !params.year || !params.season) return;

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const query = `filter=${params.filter}&page=${page}`;
        const result = await getSeason(params.year, params.season, query);

        if (cancelled) return;

        const safeData = Array.isArray(result?.data) ? result.data : [];
        const safePagination = result?.pagination ?? null;

        setData(safeData);
        setPagination(safePagination);
      } catch (err) {
        if (!cancelled) {
          console.error("getSeason error:", err);
          setError(err?.message || "Failed to load data");
          setData([]);
          setPagination(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [isClient, params, page]);

  const filtered = uniqueByMalId(filterByBroadcast(data, params.filter));
  const perPage = pagination?.items?.per_page ?? 20;
  const totalItems = pagination?.items?.total ?? filtered.length;
  const startIndex = pagination ? (page - 1) * perPage + 1 : 0;
  const endIndex = pagination
    ? startIndex + filtered.length - 1
    : filtered.length;

  // Handle filter change
  const handleFilterChange = (val) => {
    setParams((prev) => ({ ...prev, filter: val }));
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

  // SSR fallback (hindari hydration mismatch)
  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  if (!params.year || !params.season) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-24">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-white">
            Season Results
          </h1>
          <p className="text-center text-white/60">
            <b>Year</b> and <b>season</b> parameters are required.
          </p>
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
        <PageHeader
          title="SEASON RESULTS"
          subtitle={`${params.season} ${params.year} Anime Season`}
          icon={<FiCalendar className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <SeasonResultControls
          params={params}
          onFilterChange={handleFilterChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            <SeasonResultStates
              loading={loading}
              error={error}
              filteredData={filtered}
              params={params}
              pagination={pagination}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </section>

        <InfoSection
          icon={<FiCalendar className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
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
