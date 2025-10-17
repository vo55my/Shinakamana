"use client";

import { uniqueByMalId } from "@/lib/uniqueHelpers";
import AnimeCard from "@/components/cards/AnimeCard";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/state/EmptyState";
import { FiClock } from "react-icons/fi";

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

const filterByBroadcast = (animeList) => {
  if (!Array.isArray(animeList)) return [];
  return animeList.filter(
    (anime) =>
      anime.broadcast?.string &&
      anime.broadcast.string.toLowerCase() !== "unknown"
  );
};

export default function ScheduleContent({
  data,
  pagination,
  loading,
  error,
  selectedDay,
  page,
  onPageChange,
}) {
  // Process data untuk ditampilkan
  const processedData = uniqueByMalId(filterByBroadcast(data));

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
          <AnimeCard key={i} loading />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<FiClock className="text-[#FF6363] text-4xl mx-auto mb-4" />}
        title={error}
        description="Please try refreshing the page or select a different day"
      />
    );
  }

  if (processedData.length === 0) {
    return (
      <EmptyState
        icon={<FiClock className="text-[#FFBD69] text-4xl mx-auto mb-4" />}
        title={`No anime scheduled for ${dayMap[selectedDay]}.`}
        description="Try selecting a different day or check back later for updates."
      />
    );
  }

  return (
    <>
      {/* Anime Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {processedData.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_visible_page > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={page}
            totalPages={pagination.last_visible_page}
            onPageChange={onPageChange}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}
