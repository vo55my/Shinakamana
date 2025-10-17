"use client";

import { uniqueByMalId } from "@/lib/uniqueHelpers";
import RankCard from "@/components/cards/RankCard";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/state/EmptyState";
import { FiTrendingUp } from "react-icons/fi";

export default function PopularContent({
  data,
  pagination,
  loading,
  error,
  activePage,
  onPageChange,
  onResetFilters,
}) {
  const uniqueData = uniqueByMalId(data);
  const totalPages = pagination?.last_visible_page ?? 1;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
          <RankCard key={i} loading index={i} page={1} perPage={25} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<FiTrendingUp className="text-[#FF6363] text-4xl mx-auto mb-4" />}
        title={error}
        description="Please try refreshing the page"
      />
    );
  }

  if (uniqueData.length === 0) {
    return (
      <EmptyState
        icon={<FiTrendingUp className="text-[#FFBD69] text-4xl mx-auto mb-4" />}
        title="No anime found matching your criteria."
        description=""
        actions={
          <button
            onClick={onResetFilters}
            className="bg-[#FF6363] hover:bg-[#FF6363]/90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 border-2 border-[#FFBD69]"
          >
            Reset Filters
          </button>
        }
      />
    );
  }

  return (
    <>
      {/* Rank Cards Grid */}
      <div className="space-y-4">
        {uniqueData.map((anime, i) => (
          <RankCard
            key={anime.mal_id}
            anime={anime}
            index={i}
            page={activePage}
            perPage={25}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={activePage}
            totalPages={Math.min(4, totalPages)}
            onPageChange={onPageChange}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}
