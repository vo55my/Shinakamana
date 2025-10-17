"use client";

import EpisodeCard from "@/components/cards/EpisodeCard";
import Pagination from "@/components/common/Pagination";

export default function AnimeEpisodesTab({
  episodes,
  episodesLoading,
  episodesPagination,
  episodesPage,
  onPageChange,
  formatEpisodeDate,
}) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl font-black text-white mb-6">EPISODES</h3>

          {episodesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-[#543864]/40 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {episodes.map((ep, idx) => (
                <EpisodeCard
                  key={ep?.mal_id ?? `ep-${idx}`}
                  episode={ep}
                  index={(episodesPage - 1) * 100 + (idx + 1)}
                  aired={formatEpisodeDate(ep?.aired)}
                />
              ))}
            </div>
          )}

          {episodesPagination &&
            (episodesPagination.last_visible_page ?? 0) > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={episodesPagination.current_page ?? episodesPage}
                  totalPages={episodesPagination.last_visible_page}
                  onPageChange={onPageChange}
                  loading={episodesLoading}
                />
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
