"use client";

import Image from "next/image";
import { FiUser } from "react-icons/fi";

export default function CharacterInfoSection({ character }) {
  return (
    <section className="pt-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6 md:p-8">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Character Image */}
            <div className="flex-shrink-0 w-full lg:w-80 space-y-6">
              <div className="relative w-full h-96 lg:h-[500px] rounded-xl overflow-hidden border-2 border-[#FFBD69] shadow-2xl">
                {character.images?.jpg?.image_url ? (
                  <Image
                    src={character.images.jpg.image_url}
                    alt={character.name || "Character image"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#543864] text-white/40">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Right: Character Details */}
            <div className="flex-1 space-y-6">
              {/* Name & Basic Info */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                  {character.name}
                </h2>
                {character.name_kanji && (
                  <p className="text-lg text-white/60 mb-6 font-japanese">
                    {character.name_kanji}
                  </p>
                )}
              </div>

              {/* About Section */}
              {character.about && (
                <div className="bg-[#0f0f1f] rounded-xl p-6 border border-[#543864]">
                  <h3 className="text-xl font-black text-white mb-4 flex items-center">
                    <FiUser className="text-[#FF6363] mr-2" />
                    ABOUT
                  </h3>
                  <div className="text-white/80 leading-relaxed">
                    {character.about.split("\n").map(
                      (paragraph, index) =>
                        paragraph.trim() && (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
