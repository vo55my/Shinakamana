"use client";

import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
}) {
  const [isClient, setIsClient] = useState(false);

  // Hindari hydration mismatch antara SSR & CSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Fallback sederhana untuk SSR
    return (
      <nav className="mt-8 flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-[#543864]/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </nav>
    );
  }

  if (totalPages <= 1) return null;

  // Fungsi pembentuk daftar halaman (dengan titik-titik)
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 1;
    const range = [];
    const rangeWithDots = [1];
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage - delta <= 2) end = Math.min(totalPages - 1, 4);
    if (currentPage + delta >= totalPages - 1)
      start = Math.max(2, totalPages - 3);

    for (let i = start; i <= end; i++) range.push(i);
    if (start > 2) rangeWithDots.push("...");
    rangeWithDots.push(...range);
    if (end < totalPages - 1) rangeWithDots.push("...");
    rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  // Skeleton Loading State
  if (loading) {
    return (
      <nav className="mt-8 flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-[#543864]/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="mt-8 select-none"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Page Info */}
        <div className="text-white/70 text-sm font-medium">
          Page <span className="text-[#FFBD69] font-bold">{currentPage}</span>{" "}
          of <span className="text-[#FF6363] font-bold">{totalPages}</span>
        </div>

        {/* Pagination Buttons */}
        <ul className="flex items-center space-x-1 sm:space-x-2 flex-wrap justify-center">
          {/* Previous Button */}
          <li>
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300 ${
                currentPage === 1
                  ? "cursor-not-allowed border-[#543864] text-white/30 bg-[#1a1a2f]"
                  : "border-[#543864] text-[#FFBD69] hover:bg-[#FF6363] hover:border-[#FF6363] hover:text-white hover:scale-105"
              }`}
              disabled={currentPage === 1 || loading}
              aria-label="Previous Page"
            >
              <FiChevronLeft size={18} />
            </button>
          </li>

          {/* Page Numbers */}
          {visiblePages.map((pageNum, index) =>
            pageNum === "..." ? (
              <li
                key={`dots-${index}`}
                className="flex items-center justify-center w-10 h-10 text-[#FFBD69]/60"
                aria-hidden="true"
              >
                <FiMoreHorizontal size={18} />
              </li>
            ) : (
              <li key={pageNum}>
                <button
                  onClick={() => onPageChange(pageNum)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg border font-medium transition-all duration-300 ${
                    pageNum === currentPage
                      ? "bg-gradient-to-br from-[#FF6363] to-[#FFBD69] border-transparent text-white shadow-lg shadow-[#FF6363]/25 scale-105"
                      : "border-[#543864] text-white/80 hover:bg-[#543864] hover:border-[#543864] hover:text-white hover:scale-105"
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={pageNum === currentPage ? "page" : undefined}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              </li>
            )
          )}

          {/* Next Button */}
          <li>
            <button
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300 ${
                currentPage === totalPages
                  ? "cursor-not-allowed border-[#543864] text-white/30 bg-[#1a1a2f]"
                  : "border-[#543864] text-[#FFBD69] hover:bg-[#FF6363] hover:border-[#FF6363] hover:text-white hover:scale-105"
              }`}
              disabled={currentPage === totalPages || loading}
              aria-label="Next Page"
            >
              <FiChevronRight size={18} />
            </button>
          </li>
        </ul>
      </div>

      {/* Quick Navigation Info */}
      <div className="text-center mt-4">
        <span className="text-white/40 text-xs">
          {totalPages > 1 ? `${totalPages} pages available` : "Single page"}
        </span>
      </div>
    </nav>
  );
}
