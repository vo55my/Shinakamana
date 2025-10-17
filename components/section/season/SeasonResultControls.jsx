import Dropdown from "@/components/common/Dropdown";
import ResultInfo from "@/components/info/ResultInfo";
import { FiPlay, FiFilter } from "react-icons/fi";

export default function SeasonResultControls({
  params,
  onFilterChange,
  startIndex,
  endIndex,
  totalItems,
}) {
  return (
    <section className="py-8 bg-[#0f0f1f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* Main Filters */}
          <div className="flex flex-wrap sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="flex items-center space-x-3">
              <FiPlay className="text-[#FFBD69] text-lg" />
              <Dropdown
                label="TYPE"
                options={[
                  { value: "tv", label: "TV Series" },
                  { value: "movie", label: "Movies" },
                ]}
                value={params.filter}
                onChange={onFilterChange}
              />
            </div>

            <div className="flex items-center space-x-3">
              <FiFilter className="text-[#FF6363] text-lg" />
              <div className="px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white rounded-xl min-w-[140px]">
                <div className="capitalize font-semibold">
                  {params.season} {params.year}
                </div>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <ResultInfo
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            extra={`${params.season} ${
              params.year
            } • ${params.filter.toUpperCase()} Series`}
          />
        </div>
      </div>
    </section>
  );
}
