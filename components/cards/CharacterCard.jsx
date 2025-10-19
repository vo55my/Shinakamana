import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function CharacterCard({ character, role, va }) {
  const img = character?.images?.jpg?.image_url;

  return (
    <Link href={`/character/${character.mal_id}`}>
      <div className="bg-[#0f0f1f] border border-[#543864] rounded-xl p-4 hover:border-[#FF6363] transition-all duration-300 cursor-pointer group">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-[#FFBD69]">
            {img ? (
              <Image
                src={img}
                alt={character.name ?? "character"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#543864] text-white/40 text-xs">
                No Image
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-lg group-hover:text-[#FFBD69] transition-colors">
              {character.name ?? "Unknown"}
            </h4>
            <p className="text-[#FFBD69] text-sm font-medium">
              {role ?? "Unknown role"}
            </p>
            {va && <p className="text-white/60 text-xs mt-1">VA: {va}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}
