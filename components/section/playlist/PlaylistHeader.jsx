"use client";

import { FiTrash2 } from "react-icons/fi";

export default function PlaylistHeader({ playlist, onClearAll }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h2 className="text-2xl font-black text-white mb-2">
          Your Anime Collection
        </h2>
        <p className="text-white/60">
          {playlist.length === 0
            ? "Start building your anime playlist by adding shows you love"
            : `You have ${playlist.length} anime in your playlist`}
        </p>
      </div>

      {playlist.length > 0 && (
        <div className="flex space-x-3">
          <button
            onClick={onClearAll}
            className="flex items-center space-x-2 px-4 py-2 bg-[#FF6363] text-white rounded-lg hover:bg-[#ff5252] transition-colors duration-300"
          >
            <FiTrash2 className="text-sm" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
}
