"use client";

import AnimeCard from "@/components/cards/AnimeCard";
import EmptyState from "@/components/state/EmptyState";
import SectionHeader from "@/components/section/home/SectionHeader";
import LoadingSkeleton from "@/components/section/home/LoadingSkeleton";
import { FiCalendar, FiArrowRight } from "react-icons/fi";

export function ButtonSection({ onClick }) {
  return (
    <>
      <button
        onClick={onClick}
        className="group flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#1a1a2f] border border-[#543864] hover:border-[#FF6363] text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-[#FF6363] hover:scale-105 text-sm sm:text-base"
      >
        <span>VIEW ALL</span>
        <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </>
  );
}

export default function AiringSection({
  airingAnime,
  airingLoading,
  airingError,
  onViewAll,
}) {
  return (
    <section id="airing" className="py-16 sm:py-20 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[#0f0f1f]"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header dengan aksi */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-12">
          <SectionHeader
            icon={<FiCalendar className="text-[#FFBD69] text-lg sm:text-xl" />}
            title="CURRENTLY AIRING"
            subtitle="Anime currently airing this season"
            color="#FF6363"
          />
          <ButtonSection onClick={onViewAll} />
        </div>

        {/* Anime cards grid */}
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 md:grid md:grid-cols-5 md:gap-4 sm:gap-6 md:overflow-visible md:space-x-0 scrollbar-hide">
          {airingLoading ? (
            <LoadingSkeleton count={5} type="card" />
          ) : airingError ? (
            <EmptyState
              icon={
                <FiCalendar className="text-[#FF6363] text-4xl mx-auto mb-4" />
              }
              title={airingError}
              description="Please try refreshing the page"
            />
          ) : airingAnime.length === 0 ? (
            <EmptyState
              icon={
                <FiCalendar className="text-[#FFBD69] text-4xl mx-auto mb-4" />
              }
              title="No currently airing anime found."
              description=""
            />
          ) : (
            airingAnime
              .slice(0, 5)
              .map((anime) => <AnimeCard key={anime.mal_id} anime={anime} />)
          )}
        </div>
      </div>
    </section>
  );
}
