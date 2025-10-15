import React from "react";

export default function EpisodeCard({ episode, index, aired }) {
  return (
    <div className="bg-[#0f0f1f] border border-[#543864] rounded-xl p-4 hover:border-[#FFBD69] transition-all duration-300">
      <div className="text-[#FF6363] font-bold text-sm mb-2">
        EPISODE {index}
      </div>
      <h4 className="text-white font-semibold mb-2 line-clamp-2">
        {episode?.title ?? `Episode ${index}`}
      </h4>
      <p className="text-white/60 text-xs">Aired: {aired}</p>
    </div>
  );
}
