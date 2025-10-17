"use client";

import AnimeCard from "@/components/cards/AnimeCard";
import EmptyState from "@/components/state/EmptyState";
import SectionHeader from "@/components/section/home/SectionHeader";
import LoadingSkeleton from "@/components/section/home/LoadingSkeleton";
import { ButtonSection } from "@/components/section/home/AiringSection";
import { FiTrendingUp } from "react-icons/fi";

export default function PopularSection({
  popularAnime,
  popularLoading,
  popularError,
  onViewAll,
}) {
  return (
    <section id="popular" className="py-16 sm:py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1a1a2f]"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-12">
          <SectionHeader
            icon={
              <FiTrendingUp className="text-[#FF6363] text-lg sm:text-xl" />
            }
            title="POPULAR ANIME"
            subtitle="Top anime based on ratings and popularity"
            color="#FFBD69"
          />
          <ButtonSection onClick={onViewAll} />
        </div>

        {/* Anime cards grid */}
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 md:grid md:grid-cols-5 md:gap-4 sm:gap-6 md:overflow-visible md:space-x-0 scrollbar-hide">
          {popularLoading ? (
            <LoadingSkeleton count={5} type="card" />
          ) : popularError ? (
            <EmptyState
              icon={
                <FiTrendingUp className="text-[#FF6363] text-4xl mx-auto mb-4" />
              }
              title={popularError}
              description="Please try refreshing the page"
            />
          ) : popularAnime.length === 0 ? (
            <EmptyState
              icon={
                <FiTrendingUp className="text-[#FFBD69] text-4xl mx-auto mb-4" />
              }
              title="No popular anime found."
              description=""
            />
          ) : (
            popularAnime
              .slice(0, 5)
              .map((anime) => <AnimeCard key={anime.mal_id} anime={anime} />)
          )}
        </div>
      </div>
    </section>
  );
}
