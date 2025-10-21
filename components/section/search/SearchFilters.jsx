"use client";

import { useState, useEffect } from "react";
import { getAnimeGenres } from "@/lib/api";
import Dropdown from "@/components/common/Dropdown";
import { FiFilter, FiPlay, FiCalendar, FiStar, FiTag } from "react-icons/fi";

export default function SearchFilters({
  keyword,
  type,
  status,
  rating, 
  startDate,
  endDate,
  genreInclude,
  genreExclude,
  onTypeChange,
  onStatusChange,
  onRatingChange,
  onStartDateChange,
  onEndDateChange,
  onGenreIncludeChange,
  onGenreExcludeChange,
}) {
  const [genres, setGenres] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch genres aman
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;
    async function fetchGenres() {
      try {
        const res = await getAnimeGenres();
        const data = res?.data;

        let combined = [];
        if (Array.isArray(data)) {
          combined = data;
        } else if (typeof data === "object") {
          // Gabungkan semua kategori genre menjadi satu array
          combined = [
            ...(data.genres ?? []),
            ...(data.explicit_genres ?? []),
            ...(data.themes ?? []),
            ...(data.demographics ?? []),
          ];
        }

        if (!cancelled) setGenres(combined);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
        if (!cancelled) setGenres([]);
      }
    }

    fetchGenres();
    return () => {
      cancelled = true;
    };
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <section className="py-8 bg-[#0f0f1f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Filters Grid */}
          <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FiFilter className="text-[#FF6363] text-xl" />
              <h3 className="text-white font-bold text-lg">FILTERS</h3>
            </div>

            <div className="space-y-6">
              {/* Type & Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <FiPlay className="text-[#FFBD69] text-lg" />
                  <Dropdown
                    label="TYPE"
                    options={[
                      { value: "", label: "All Types" },
                      { value: "tv", label: "TV Series" },
                      { value: "movie", label: "Movies" },
                      { value: "ova", label: "OVA" },
                      { value: "ona", label: "ONA" },
                      { value: "special", label: "Special" },
                    ]}
                    value={type}
                    onChange={onTypeChange}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <FiCalendar className="text-[#FF6363] text-lg" />
                  <Dropdown
                    label="STATUS"
                    options={[
                      { value: "", label: "All Status" },
                      { value: "airing", label: "Currently Airing" },
                      { value: "complete", label: "Completed" },
                      { value: "upcoming", label: "Upcoming" },
                    ]}
                    value={status}
                    onChange={onStatusChange}
                  />
                </div>
              </div>

              {/* Rating Row */}
              <div className="flex items-center space-x-3">
                <FiStar className="text-[#FFBD69] text-lg" />
                <Dropdown
                  label="RATING"
                  options={[
                    { value: "", label: "All Ratings" },
                    { value: "g", label: "G - All Ages" },
                    { value: "pg", label: "PG - Children" },
                    { value: "pg13", label: "PG-13 - Teens 13+" },
                    {
                      value: "r17",
                      label: "R - 17+ (violence & profanity)",
                    },
                    { value: "r", label: "R+ - Mild Nudity" },
                    { value: "rx", label: "Rx - Hentai" },
                  ]}
                  value={rating}
                  onChange={onRatingChange}
                />
              </div>

              {/* Genre Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <FiTag className="text-[#FF6363] text-lg" />
                  <Dropdown
                    label="INCLUDE GENRES"
                    options={[
                      { value: "", label: "All Genres" },
                      ...genres.map((g) => ({
                        value: g.mal_id?.toString() ?? "",
                        label: g.name ?? "Unknown",
                      })),
                    ]}
                    value={genreInclude}
                    onChange={onGenreIncludeChange}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <FiTag className="text-[#FFBD69] text-lg" />
                  <Dropdown
                    label="EXCLUDE GENRES"
                    options={[
                      { value: "", label: "No Exclusions" },
                      ...genres.map((g) => ({
                        value: g.mal_id?.toString() ?? "",
                        label: g.name ?? "Unknown",
                      })),
                    ]}
                    value={genreExclude}
                    onChange={onGenreExcludeChange}
                  />
                </div>
              </div>

              {/* Date Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-white/70 text-sm font-medium uppercase">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white rounded-xl focus:outline-none focus:border-[#FF6363]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-white/70 text-sm font-medium uppercase">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white rounded-xl focus:outline-none focus:border-[#FF6363]"
                  />
                </div>
              </div>

              {/* Info Text */}
              <div className="text-center p-4 bg-[#0f0f1f] rounded-xl border border-[#543864]">
                <p className="text-white/70 text-sm">
                  <strong>Tip:</strong> Click the search button above to apply
                  your filters. You can search with keywords, filters, or both!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
