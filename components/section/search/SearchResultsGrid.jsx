"use client";

import AnimeCard from "@/components/cards/AnimeCard";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/state/EmptyState";
import { FiSearch } from "react-icons/fi";

export default function SearchResultsGrid({
  searchQuery,
  data,
  pagination,
  loading,
  error,
  page,
  onPageChange,
}) {
  // Cek apakah ada parameter pencarian
  const hasSearchParams =
    searchQuery.q ||
    searchQuery.type ||
    searchQuery.status ||
    searchQuery.rating ||
    searchQuery.genres ||
    searchQuery.genres_exclude ||
    searchQuery.start_date ||
    searchQuery.end_date;

  // Kondisi awal tanpa parameter
  if (!hasSearchParams) {
    return (
      <EmptyState
        icon={<FiSearch className="text-[#FFBD69] text-4xl mx-auto mb-4" />}
        title="Please enter keywords or filters to search for anime."
        description="Use the search page to find your favorite anime with detailed filters."
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
          <AnimeCard key={i} loading />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon={<FiSearch className="text-[#FF6363] text-4xl mx-auto mb-4" />}
        title={error}
        description="Please try refreshing the page or adjusting your search filters"
      />
    );
  }

  // No results state
  if (data.length === 0) {
    return (
      <EmptyState
        icon={<FiSearch className="text-[#FFBD69] text-4xl mx-auto mb-4" />}
        title="No anime found with the specified criteria."
        description="Try adjusting your search filters or using different keywords."
      />
    );
  }

  // Results state
  return (
    <>
      {/* Anime Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {data.map((anime) => (
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
