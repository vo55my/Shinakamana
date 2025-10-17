import AnimeCard from "@/components/cards/AnimeCard";
import GenreResultGrid from "./GenreResultGrid";
import { FiTag } from "react-icons/fi";

export default function GenreResultStates({
  genreId,
  loading,
  error,
  uniqueData,
  genreName,
  pagination,
  page,
  onPageChange,
}) {
  // Kondisi tanpa genre
  if (!genreId) {
    return (
      <>
        <div className="text-center py-12">
          <FiTag className="text-[#FFBD69] text-4xl mx-auto mb-4" />
          <div className="text-white/60 text-lg mb-4">
            Please select a genre to browse anime
          </div>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Use the genre dropdown above to explore anime by different genres
            and categories.
          </p>
        </div>
      </>
    );
  }

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
        <div className="text-center py-12">
          <div className="text-[#FF6363] text-lg font-semibold mb-2">
            {error}
          </div>
          <p className="text-white/60">
            Please try refreshing the page or selecting a different genre
          </p>
        </div>
      </>
    );
  }

  // Empty state
  if (uniqueData.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <FiTag className="text-[#FFBD69] text-4xl mx-auto mb-4" />
          <div className="text-white/60 text-lg mb-4">
            No anime found in {genreName} genre
          </div>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Try selecting a different genre or check back later for new
            additions.
          </p>
        </div>
      </>
    );
  }

  // Success state - menampilkan grid anime
  return (
    <>
      <GenreResultGrid
        uniqueData={uniqueData}
        pagination={pagination}
        page={page}
        onPageChange={onPageChange}
        loading={loading}
      />
    </>
  );
}
