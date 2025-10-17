"use client";

import { FiStar, FiPlay, FiUsers, FiAward } from "react-icons/fi";

export default function AnimeStatsGrid({ anime }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {anime.score && (
        <div className="bg-[#543864] rounded-xl p-4 text-center border border-[#543864] hover:border-[#FFBD69] transition-colors duration-300">
          <FiStar className="text-[#FFBD69] text-xl mx-auto mb-2" />
          <div className="text-white font-bold text-lg">{anime.score}</div>
          <div className="text-white/60 text-sm">SCORE</div>
        </div>
      )}
      {anime.rank && (
        <div className="bg-[#543864] rounded-xl p-4 text-center border border-[#543864] hover:border-[#FF6363] transition-colors duration-300">
          <FiAward className="text-[#FF6363] text-xl mx-auto mb-2" />
          <div className="text-white font-bold text-lg">#{anime.rank}</div>
          <div className="text-white/60 text-sm">RANK</div>
        </div>
      )}
      {anime.popularity && (
        <div className="bg-[#543864] rounded-xl p-4 text-center border border-[#543864] hover:border-[#FFBD69] transition-colors duration-300">
          <FiUsers className="text-[#FFBD69] text-xl mx-auto mb-2" />
          <div className="text-white font-bold text-lg">
            #{anime.popularity}
          </div>
          <div className="text-white/60 text-sm">POPULARITY</div>
        </div>
      )}
      {anime.episodes && (
        <div className="bg-[#543864] rounded-xl p-4 text-center border border-[#543864] hover:border-[#FF6363] transition-colors duration-300">
          <FiPlay className="text-[#FF6363] text-xl mx-auto mb-2" />
          <div className="text-white font-bold text-lg">{anime.episodes}</div>
          <div className="text-white/60 text-sm">EPISODES</div>
        </div>
      )}
    </div>
  );
}
