"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiMenu,
  FiX,
  FiStar,
  FiSearch,
  FiCalendar,
  FiTrendingUp,
  FiPlay,
  FiTag,
} from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isClient) {
    return (
      <nav className="bg-[#0f0f1f] fixed top-0 left-0 w-full z-50 py-3 border-b border-[#543864]">
        <div className="w-full px-4 md:px-6 lg:px-8 flex items-center justify-between">
          <span id="brand" className="text-xl font-bold text-white">
            SHINAKAMANA
          </span>
          <div className="hidden md:flex space-x-6 font-medium text-white/80">
            <span>Season</span>
            <span>Popular</span>
            <span>Schedule</span>
            <span>Search</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0f0f1f]/95 border-b border-[#FF6363]/30 shadow-lg"
          : "bg-[#0f0f1f] border-b border-[#543864]"
      }`}
    >
      {/* Top Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-[#FF6363] via-[#FFBD69] to-[#543864]"></div>

      <div className="w-full px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo - Left */}
        <Link href="/" className="group flex items-center space-x-2">
          <span
            id="brand"
            className="text-xl font-bold text-white tracking-wide group-hover:text-[#FFBD69] transition-colors duration-300"
          >
            SHINAKAMANA
          </span>
        </Link>

        {/* Center Navigation - Desktop */}
        <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
          {[
            { href: "/season", label: "SEASON", icon: FiStar },
            { href: "/popular", label: "POPULAR", icon: FiTrendingUp },
            { href: "/schedule", label: "SCHEDULE", icon: FiCalendar },
            { href: "/search", label: "SEARCH", icon: FiSearch },
            { href: "/genre", label: "GENRE", icon: FiTag },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#1a1a2f] text-white/80 hover:text-white border border-transparent hover:border-[#FF6363]/20"
            >
              <item.icon className="text-[#FFBD69] text-sm group-hover:text-[#FF6363] transition-colors duration-300" />
              <span className="font-medium text-sm tracking-wide">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Side - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Playlist Button */}
          <Link href="/playlist" prefetch={false} className="group relative">
            <div className="bg-[#FF6363] hover:bg-[#FF6363]/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-[#FFBD69] shadow-lg hover:shadow-[#FF6363]/25 flex items-center space-x-2">
              <FiPlay className="text-xs" />
              <span className="text-sm tracking-wide">MY PLAYLIST</span>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden group p-2 rounded-lg bg-[#1a1a2f] border border-[#543864] hover:border-[#FF6363] transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <div className="relative">
            {isOpen ? (
              <FiX className="text-[#FFBD69] text-lg group-hover:text-[#FF6363] transition-colors duration-300" />
            ) : (
              <FiMenu className="text-[#FFBD69] text-lg group-hover:text-[#FF6363] transition-colors duration-300" />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f0f1f] border-r border-[#FF6363]/30 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-[#543864] bg-[#0f0f1f]">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2"
          >
            <span
              id="brand"
              className="text-lg font-bold text-white tracking-wide"
            >
              SHINAKAMANA
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg bg-[#1a1a2f] border border-[#543864] hover:border-[#FF6363] transition-colors duration-300"
            aria-label="Close menu"
          >
            <FiX className="text-[#FFBD69] hover:text-[#FF6363] transition-colors duration-300" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="p-6 space-y-2">
          {[
            {
              href: "/season",
              label: "SEASON",
              icon: FiStar,
              color: "from-[#FFBD69] to-[#FF6363]",
            },
            {
              href: "/popular",
              label: "POPULAR",
              icon: FiTrendingUp,
              color: "from-[#FF6363] to-[#FFBD69]",
            },
            {
              href: "/schedule",
              label: "SCHEDULE",
              icon: FiCalendar,
              color: "from-[#FFBD69] to-[#543864]",
            },
            {
              href: "/search",
              label: "SEARCH",
              icon: FiSearch,
              color: "from-[#543864] to-[#FF6363]",
            },
            {
              href: "/genre",
              label: "GENRE",
              icon: FiTag,
              color: "from-[#FF6363] to-[#543864]",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className="group flex items-center space-x-4 p-4 rounded-xl bg-[#1a1a2f] border border-[#543864] hover:border-[#FF6363] transition-all duration-300 hover:scale-105"
            >
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${item.color} shadow-lg`}
              >
                <item.icon className="text-white text-lg" />
              </div>
              <div>
                <div className="text-white font-bold text-md tracking-wide group-hover:text-[#FFBD69] transition-colors duration-300">
                  {item.label}
                </div>
                <div className="text-white/60 text-xs tracking-wide">
                  Explore {item.label.toLowerCase()} anime
                </div>
              </div>
            </Link>
          ))}

          {/* Mobile Playlist Button */}
          <div className="pt-4">
            <Link
              href="/playlist"
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#FF6363] hover:bg-[#FF6363]/90 text-white font-semibold transition-all duration-300 border-2 border-[#FFBD69]"
            >
              <FiPlay className="text-sm" />
              <span className="text-sm">My Playlist</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
