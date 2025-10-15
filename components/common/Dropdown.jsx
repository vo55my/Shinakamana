"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

/**
 * Dropdown aman untuk SSR (bebas hydration error)
 * @param {Object} props
 * @param {string} props.label - Label dropdown
 * @param {Array<{value: string, label: string}>} props.options - Pilihan dropdown
 * @param {string} props.value - Nilai aktif
 * @param {function} props.onChange - Callback perubahan nilai
 */

export default function Dropdown({ label, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Hanya aktifkan interaktivitas di sisi client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    if (!mounted) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label || "Select...";

  // SSR-safe fallback
  if (!mounted) {
    return (
      <div className="relative w-full sm:w-64">
        <button
          disabled
          className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white/80 rounded-xl font-medium"
        >
          <span className="truncate">{displayLabel}</span>
          <FiChevronDown className="ml-2 flex-shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-64">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a2f] border border-[#543864] text-white/80 rounded-xl font-medium hover:border-[#FF6363] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6363] focus:ring-opacity-50 group"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label} dropdown`}
      >
        <span className="truncate text-sm font-semibold group-hover:text-white transition-colors duration-300">
          {displayLabel}
        </span>
        <FiChevronDown
          className={`ml-2 flex-shrink-0 transition-transform duration-300 text-[#FFBD69] group-hover:text-[#FF6363] ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute left-0 right-0 mt-2 bg-[#1a1a2f] border border-[#543864] rounded-xl shadow-2xl shadow-[#FF6363]/10 backdrop-blur-sm z-50 max-h-60 overflow-y-auto overscroll-contain"
          role="listbox"
        >
          {/* Dropdown Header */}
          <div className="px-4 py-3 border-b border-[#543864]">
            <span className="text-white font-bold text-sm tracking-wide uppercase">
              {label}
            </span>
          </div>

          {/* Options List */}
          <div className="py-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-300 group ${
                  value === opt.value
                    ? "bg-[#543864] text-[#FFBD69] font-semibold"
                    : "hover:bg-[#543864]/50 hover:text-white text-white/80"
                }`}
                type="button"
                role="option"
                aria-selected={value === opt.value}
              >
                <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                  {opt.label}
                </span>

                {value === opt.value && (
                  <FiCheck className="text-[#FF6363] flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>

          {/* Dropdown Footer */}
          <div className="px-4 py-2 border-t border-[#543864]">
            <div className="text-center">
              <span className="text-white/40 text-xs">
                {options.length} options
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
