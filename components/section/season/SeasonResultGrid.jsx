import AnimeCard from "@/components/cards/AnimeCard";
import Pagination from "@/components/common/Pagination";

export default function SeasonResultGrid({
  filteredData,
  pagination,
  page,
  onPageChange,
  loading,
}) {
  return (
    <>
      {/* Anime Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {filteredData.map((anime) => (
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
