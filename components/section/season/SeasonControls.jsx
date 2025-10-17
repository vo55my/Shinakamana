import Dropdown from "@/components/common/Dropdown";
import ResultInfo from "@/components/info/ResultInfo";
import { FiPlay, FiFilter, FiCalendar, FiSearch } from "react-icons/fi";

export default function SeasonControls({
  activeType,
  activeSeason,
  onTypeChange,
  onSeasonChange,
  startIndex,
  endIndex,
  totalItems,
  season,
  year,
  onSeasonSelect,
  onYearChange,
  onSearchSeason,
}) {
  return (
    <section className="py-8 bg-[#0f0f1f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* Main Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="flex items-center space-x-3">
              <FiPlay className="text-[#FFBD69] text-lg" />
              <Dropdown
                label="TYPE"
                options={[
                  { value: "tv", label: "TV Series" },
                  { value: "movie", label: "Movies" },
                ]}
                value={activeType}
                onChange={onTypeChange}
              />
            </div>

            <div className="flex items-center space-x-3">
              <FiFilter className="text-[#FF6363] text-lg" />
              <Dropdown
                label="SEASON"
                options={[
                  { value: "now", label: "Currently Airing" },
                  { value: "upcoming", label: "Upcoming" },
                ]}
                value={activeSeason}
                onChange={onSeasonChange}
              />
            </div>
          </div>

          {/* Results Info */}
          <ResultInfo
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            extra={`${
              activeSeason === "now" ? "Currently Airing" : "Upcoming"
            } ${activeType.toUpperCase()} Series`}
          />
        </div>

        {/* Manual Season Search */}
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <FiCalendar className="text-[#FFBD69] text-xl" />
              <h3 className="text-white font-bold text-lg">
                SEARCH SPECIFIC SEASON
              </h3>
            </div>

            <div className="flex flex-wrap sm:flex-row gap-3">
              <div className="flex items-center space-x-3">
                <Dropdown
                  label="SEASON"
                  options={[
                    { value: "winter", label: "Winter" },
                    { value: "spring", label: "Spring" },
                    { value: "summer", label: "Summer" },
                    { value: "fall", label: "Fall" },
                  ]}
                  value={season}
                  onChange={onSeasonSelect}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1917"
                  max={new Date().getFullYear() + 1}
                  value={year}
                  onChange={(e) => onYearChange(e.target.value)}
                  className="px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white rounded-xl focus:outline-none focus:border-[#FF6363] placeholder-white/40 w-32"
                  placeholder="Year"
                />
              </div>

              <button
                onClick={onSearchSeason}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-[#0f0f1f] font-bold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-transparent"
              >
                <FiSearch size={18} />
                <span>SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
