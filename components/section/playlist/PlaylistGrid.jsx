"use client";

import AnimeCard from "@/components/cards/AnimeCard";
import { FiTrash2 } from "react-icons/fi";

export default function PlaylistGrid({ playlist, onDeleteAnime }) {
  if (playlist.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
      {playlist.map((anime) => (
        <div key={anime.mal_id} className="relative group">
          <AnimeCard anime={anime} />

          {/* Delete Button Overlay */}
          <button
            onClick={() => onDeleteAnime(anime)}
            className="absolute top-3 right-25 z-10 p-2 bg-[#FF6363] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
            aria-label={`Remove ${anime.title} from playlist`}
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      ))}
    </div>
  );
}
