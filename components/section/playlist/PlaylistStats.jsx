"use client";

import StatsCard from "@/components/cards/StatsCard";
import { FiFolder, FiClock, FiStar, FiUsers } from "react-icons/fi";

export default function PlaylistStats({ playlist }) {
  const stats = {
    total: playlist.length,
    totalEpisodes: playlist.reduce(
      (sum, anime) => sum + (anime.episodes || 0),
      0
    ),
    averageScore:
      playlist.length > 0
        ? (
            playlist.reduce((sum, anime) => sum + (anime.score || 0), 0) /
            playlist.length
          ).toFixed(2)
        : 0,
    totalMembers: playlist.reduce(
      (sum, anime) => sum + (anime.members || 0),
      0
    ),
  };

  if (playlist.length === 0) return null;

  return (
    <section className="py-8 bg-[#0f0f1f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            icon={<FiFolder className="text-[#FF6363] text-2xl mx-auto mb-2" />}
            value={stats.total}
            label="Total Anime"
            color="#FF6363"
          />
          <StatsCard
            icon={<FiClock className="text-[#FFBD69] text-2xl mx-auto mb-2" />}
            value={stats.totalEpisodes}
            label="Total Episodes"
            color="#FFBD69"
          />
          <StatsCard
            icon={<FiStar className="text-[#543864] text-2xl mx-auto mb-2" />}
            value={stats.averageScore}
            label="Avg Score"
            color="#543864"
          />
          <StatsCard
            icon={<FiUsers className="text-[#FF6363] text-2xl mx-auto mb-2" />}
            value={`${(stats.totalMembers / 1000000).toFixed(1)}M`}
            label="Total Members"
            color="#FF6363"
          />
        </div>
      </div>
    </section>
  );
}
