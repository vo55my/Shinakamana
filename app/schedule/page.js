"use client";

import { useState, useEffect, useCallback } from "react";
import { getSchedules } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import ScheduleControls from "@/components/section/schedule/ScheduleControls";
import ScheduleContent from "@/components/section/schedule/ScheduleContent";
import { FiCalendar } from "react-icons/fi";

// Fungsi untuk mendapatkan hari ini dalam format yang sesuai
const getToday = () => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, dst.
  return days[todayIndex];
};

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(getToday()); // Set default ke hari ini
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

  const totalItems = pagination?.items?.total ?? 0;

  // Handler untuk perubahan hari
  const handleDayChange = (day) => {
    setSelectedDay(day);
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

  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 pt-15">
        {/* Header Section */}
        <PageHeader
          title="ANIME SCHEDULE"
          subtitle="Track your favorite anime airing schedule and never miss an episode"
          icon={<FiCalendar className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

        {/* Controls Section */}
        <ScheduleControls
          selectedDay={selectedDay}
          page={page}
          totalItems={totalItems}
          dataLength={data.length} // Data length sebelum processing
          onDayChange={handleDayChange}
        />

        {/* Content Section */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            <ScheduleContent
              data={data} // Data mentah, diproses di ScheduleContent
              pagination={pagination}
              loading={loading}
              error={error}
              selectedDay={selectedDay}
              page={page}
              onPageChange={setPage}
            />
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
