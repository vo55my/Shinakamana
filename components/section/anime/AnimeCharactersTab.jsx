"use client";

import CharacterCard from "@/components/cards/CharacterCard";
import Pagination from "@/components/common/Pagination";

export default function AnimeCharactersTab({
  characters,
  charactersLoading,
  charactersPagination,
  charactersPage,
  onPageChange,
}) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl font-black text-white mb-6">
            CHARACTERS & VOICE ACTORS
          </h3>

          {charactersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-[#543864]/40 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {characters.map((ch, idx) => (
                <CharacterCard
                  key={ch?.character?.mal_id ?? `ch-${idx}`}
                  character={ch?.character}
                  role={ch?.role}
                  va={ch.voice_actors?.[0]?.person?.name}
                />
              ))}
            </div>
          )}

          {charactersPagination &&
            charactersPagination.last_visible_page > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={charactersPage}
                  totalPages={charactersPagination.last_visible_page}
                  onPageChange={onPageChange}
                  loading={charactersLoading}
                />
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
