"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiCalendar,
  FiSearch,
  FiTag,
} from "react-icons/fi";

export default function Footer() {
  const [year, setYear] = useState("");
  const [isLoved, setIsLoved] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleLoveClick = () => {
    setIsLoved(!isLoved);
  };

  return (
    <footer className="bg-[#0f0f1f] border-t border-[#543864]">
      {/* Top Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-[#FF6363] via-[#FFBD69] to-[#543864]"></div>

      <div className="w-full max-w-screen-xl mx-auto p-6 md:py-6">
        {/* Main Content */}
        <div className="md:flex md:items-center md:justify-between">
          {/* Logo & Brand Section */}
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <Link href="/" className="group flex items-center space-x-3 mb-4">
              <div className="relative">
                <Image
                  src="/Shinakamana.png"
                  alt="Shinakamana Logo"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-[#FFBD69] group-hover:border-[#FF6363] transition-all duration-300"
                />
              </div>
              <span
                id="brand"
                className="text-xl font-bold text-white tracking-wide group-hover:text-[#FFBD69] transition-colors duration-300"
              >
                SHINAKAMANA
              </span>
            </Link>

            <p className="text-white/60 text-sm text-center md:text-left max-w-xs">
              Discover and explore your favorite anime series with detailed
              information and updates.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">
              EXPLORE
            </h3>
            <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center md:justify-end gap-3">
              {[
                { href: "/season", label: "Season", icon: FiStar },
                { href: "/popular", label: "Popular", icon: FiTrendingUp },
                { href: "/schedule", label: "Schedule", icon: FiCalendar },
                { href: "/search", label: "Search", icon: FiSearch },
                { href: "/genre", label: "Genre", icon: FiTag },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#1a1a2f] border border-[#543864] hover:border-[#FF6363] text-white/80 hover:text-white transition-all duration-300 group min-w-[100px] justify-center"
                  prefetch={false}
                >
                  <item.icon className="text-[#FFBD69] group-hover:text-[#FF6363] text-sm transition-colors duration-300" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#543864] to-transparent"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Copyright */}
          <div className="text-center sm:text-left">
            <span className="block text-white/60 text-sm">
              © {year || "...."}{" "}
              <Link
                href="/"
                className="text-[#FFBD69] hover:text-[#FF6363] font-semibold transition-colors duration-300"
              >
                Shinakamana
              </Link>
              .
            </span>
            <span className="text-white/40 text-xs mt-1 block">
              Powered by Jikan API
            </span>
          </div>

          {/* Made with Love */}
          <div
            className="flex items-center justify-center sm:justify-end space-x-2 text-white/60 cursor-pointer group"
            onClick={handleLoveClick}
          >
            <span className="text-sm group-hover:text-white transition-colors duration-300">
              Made with
            </span>
            {isLoved ? (
              <FiHeart className="text-[#FF6363] fill-[#FF6363] transition-all duration-300" />
            ) : (
              <FiHeart className="text-[#FF6363] group-hover:scale-110 transition-all duration-300" />
            )}
            <span className="text-sm group-hover:text-white transition-colors duration-300">
              for anime fans
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-[#543864] via-[#FF6363] to-[#FFBD69] opacity-40"></div>
    </footer>
  );
}
