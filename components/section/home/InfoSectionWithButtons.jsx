"use client";

import InfoSection from "@/components/info/InfoSection";
import { FiInfo } from "react-icons/fi";

export function InfoButtons({ onClick, description }) {
  return (
    <>
      <button
        onClick={onClick}
        className="bg-[#FF6363] hover:bg-[#FF6363]/90 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 border-2 border-[#FFBD69] shadow-lg hover:shadow-[#FF6363]/25 text-sm sm:text-base"
      >
        {description}
      </button>
    </>
  );
}

export default function InfoSectionWithButtons({ onSearch, onSchedule }) {
  return (
    <InfoSection
      icon={
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF6363] to-[#FFBD69] rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-2xl">
          <FiInfo className="text-white text-xl sm:text-2xl" />
        </div>
      }
      title="EXPLORE ANIME UNIVERSE"
      description="Dive into the world of anime with detailed information, character profiles, episode guides, and much more."
      note={
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6">
          <InfoButtons onClick={onSearch} description="SEARCH ANIME" />
          <InfoButtons onClick={onSchedule} description="VIEW SCHEDULE" />
        </div>
      }
    />
  );
}
