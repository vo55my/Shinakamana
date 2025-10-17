"use client";

import Dropdown from "@/components/common/Dropdown";
import ResultInfo from "@/components/info/ResultInfo";
import { FiPlay, FiFilter } from "react-icons/fi";

export default function PopularControls({
  activeTab,
  activeFilter,
  activePage,
  totalItems,
  onTabChange,
  onFilterChange,
}) {
  // Hitung info jumlah data
  const perPage = 25;
  const startIndex = (activePage - 1) * perPage + 1;
  const endIndex = Math.min(startIndex + perPage - 1, totalItems);

  const filterLabel =
    activeFilter === "bypopularity" ? "popularity" : activeFilter;

  return (
    <section className="py-8 bg-[#0f0f1f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Dropdown Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="flex items-center space-x-3">
              <FiPlay className="text-[#FFBD69] text-lg" />
              <Dropdown
                label="TYPE"
                options={[
                  { value: "tv", label: "TV Series" },
                  { value: "movie", label: "Movies" },
                ]}
                value={activeTab}
                onChange={onTabChange}
              />
            </div>

            <div className="flex items-center space-x-3">
              <FiFilter className="text-[#FF6363] text-lg" />
              <Dropdown
                label="FILTER"
                options={[
                  { value: "bypopularity", label: "Most Popular" },
                  { value: "airing", label: "Currently Airing" },
                  { value: "upcoming", label: "Upcoming" },
                  { value: "favorite", label: "Most Favorited" },
                ]}
                value={activeFilter}
                onChange={onFilterChange}
              />
            </div>
          </div>

          {/* Results Info */}
          <ResultInfo
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            extra={`Sorted by ${filterLabel}`}
          />
        </div>
      </div>
    </section>
  );
}
