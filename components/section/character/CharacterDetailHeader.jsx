"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export default function CharacterDetailHeader({ character }) {
  const router = useRouter();

  return (
    <section className="relative py-8 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-4 truncate">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a2f] border border-[#543864] hover:border-[#FF6363] text-white rounded-xl transition-all duration-300"
          >
            <FiArrowLeft size={18} />
            <span className="font-semibold">BACK</span>
          </button>
          <div className="flex-1">
            <h1 className="text-md sm:text-3xl font-black text-white">
              {character?.name ?? "CHARACTER DETAILS"}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
