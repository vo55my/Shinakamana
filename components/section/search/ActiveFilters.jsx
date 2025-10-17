"use client";

import { FiFilter } from "react-icons/fi";

export default function ActiveFilters({ searchQuery }) {
  const hasActiveFilters =
    searchQuery.q ||
    searchQuery.type ||
    searchQuery.status ||
    searchQuery.rating ||
    searchQuery.genres;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <div className="flex items-center space-x-3">
        <FiFilter className="text-[#FF6363] text-lg" />
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-4">
          <div className="text-xs text-white/60 uppercase font-bold mb-2">
            ACTIVE FILTERS
          </div>
          <div className="flex flex-wrap gap-2 uppercase">
            {searchQuery.q && (
              <span className="px-3 py-1 bg-[#FF6363] text-white text-sm rounded-full font-medium">
                Keyword: {searchQuery.q}
              </span>
            )}
            {searchQuery.type && (
              <span className="px-3 py-1 bg-[#FFBD69] text-[#0f0f1f] text-sm rounded-full font-medium">
                Type: {searchQuery.type}
              </span>
            )}
            {searchQuery.status && (
              <span className="px-3 py-1 bg-[#543864] text-white text-sm rounded-full font-medium">
                Status: {searchQuery.status}
              </span>
            )}
            {searchQuery.rating && (
              <span className="px-3 py-1 bg-[#FF6363] text-white text-sm rounded-full font-medium">
                Rating: {searchQuery.rating}
              </span>
            )}
            {searchQuery.genres && (
              <span className="px-3 py-1 bg-[#FFBD69] text-[#0f0f1f] text-sm rounded-full font-medium">
                Genres: {searchQuery.genres}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
