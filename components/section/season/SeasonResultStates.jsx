import { FiCalendar } from "react-icons/fi";
import AnimeCard from "@/components/cards/AnimeCard";
import EmptyState from "@/components/state/EmptyState";
import SeasonResultGrid from "./SeasonResultGrid";

export default function SeasonResultStates({
  loading,
  error,
  filteredData,
  params,
  pagination,
  page,
  onPageChange,
}) {
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
          icon={<FiCalendar className="text-[#FF6363] text-4xl mx-auto mb-4" />}
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
          icon={<FiCalendar className="text-[#FFBD69] text-4xl mx-auto mb-4" />}
          title={`No anime found for ${params.season} ${params.year}.`}
          description="Try searching for a different season or year."
        />
      </>
    );
  }

  // Success state - menampilkan grid anime
  return (
    <>
      <SeasonResultGrid
        filteredData={filteredData}
        pagination={pagination}
        page={page}
        onPageChange={onPageChange}
        loading={loading}
      />
    </>
  );
}
