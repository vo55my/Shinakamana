"use client";

import Search from "@/components/common/Search";

export default function HeroSection({ onSearch }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2f] to-[#0f0f1f] text-white overflow-hidden px-4 sm:px-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF6363]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFBD69]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#543864]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative text-center w-full max-w-4xl z-10 px-4 sm:px-6">
        {/* Main heading */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <h1
              id="brand"
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-[#FF6363]"
            >
              SHINAKAMANA
            </h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 font-light px-2">
            Discover and explore{" "}
            <span className="text-[#FFBD69] font-semibold">anime</span> with
            comprehensive information
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-2xl mx-auto mb-12 px-2 sm:px-0">
          <Search onSearch={onSearch} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#FFBD69] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#FFBD69] rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
