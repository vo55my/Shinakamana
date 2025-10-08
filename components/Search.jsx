"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

export default function Search({ onSearch, initialValue = "" }) {
  const [query, setQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Hindari hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setQuery(initialValue || "");
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && onSearch) onSearch(trimmed);
  };

  const handleClear = () => {
    setQuery("");
    // Optional: Trigger search with empty query to reset results
    if (onSearch) onSearch("");
  };

  // SSR-safe fallback (hindari mismatch Next.js)
  if (!isClient) {
    return (
      <div className="flex items-center w-full max-w-lg mx-auto animate-pulse">
        <div className="w-full h-12 bg-[#543864]/50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex items-center w-full max-w-lg mx-auto relative group"
    >
      {/* Input pencarian */}
      <input
        type="search"
        placeholder="Search anime..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full pl-4 pr-12 py-4 bg-[#1a1a2f] border border-[#543864] text-white placeholder-white/60 rounded-xl focus:outline-none focus:border-[#FF6363] focus:ring-2 focus:ring-[#FF6363]/20 transition-all duration-300 group-hover:border-[#FFBD69]"
        aria-label="Search anime"
      />

      {/* Search Button - Right */}
      <button
        type="submit"
        className="absolute right-3 flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-white rounded-lg hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6363] focus:ring-offset-2 focus:ring-offset-[#1a1a2f]"
        aria-label="Search"
      >
        <FiSearch size={16} />
      </button>

      {/* Focus/Active Indicator */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF6363] to-[#FFBD69] opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10 ${
          isFocused ? "opacity-20" : ""
        }`}
      ></div>
    </form>
  );
}
