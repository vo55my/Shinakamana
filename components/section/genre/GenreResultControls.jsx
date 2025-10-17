import Dropdown from "@/components/common/Dropdown";
import ResultInfo from "@/components/info/ResultInfo";
import { FiTag } from "react-icons/fi";

export default function GenreResultControls({
  genreId,
  genreName,
  genreOptions,
  onGenreChange,
  startIndex,
  endIndex,
  totalItems,
}) {
  return (
    <section className="py-8 bg-[#0f0f1f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* Genre Filter Dropdown */}
          <div className="flex items-center space-x-3">
            <FiTag className="text-[#FF6363] text-lg flex-shrink-0" />
            <Dropdown
              label="Select Genre"
              options={genreOptions}
              value={genreId}
              onChange={onGenreChange}
            />
          </div>
          {/* Results Info */}
          <ResultInfo
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            extra={genreName ? `${genreName} Genre` : "All genres"}
          />
        </div>
      </div>
    </section>
  );
}
