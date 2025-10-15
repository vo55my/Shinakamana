import React from "react";
import Image from "next/image";

export default function CharacterCard({ character, role, va }) {
  const img = character?.images?.jpg?.image_url;
  return (
    <div className="bg-[#0f0f1f] border border-[#543864] rounded-xl p-4 hover:border-[#FF6363] transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-[#FFBD69]">
          {img ? (
            <Image
              src={img}
              alt={character.name ?? "character"}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#543864] text-white/40 text-xs">
              No Image
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-bold text-lg">
            {character.name ?? "Unknown"}
          </h4>
          <p className="text-[#FFBD69] text-sm font-medium">
            {role ?? "Unknown role"}
          </p>
          {va && <p className="text-white/60 text-xs mt-1">VA: {va}</p>}
        </div>
      </div>
    </div>
  );
}
