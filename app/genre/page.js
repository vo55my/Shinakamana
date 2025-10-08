"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAnimeGenres } from "@/lib/api";
import { FiTag, FiGrid } from "react-icons/fi";

export default function GenrePage() {
  const router = useRouter();
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    async function fetchGenres() {
      try {
        console.log("Fetching genres from Jikan API...");
        const result = await getAnimeGenres();
        console.log("Raw API Response:", result);

        // Ambil semua data tanpa filter
        const data = result?.data ?? [];
        console.log("All genres data:", data);
        console.log("Total genres:", data.length);

        // Tampilkan semua genre dalam satu array
        setAllGenres(data);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
        setError(err?.message || "Failed to load genres");
        setAllGenres([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGenres();
  }, [isClient]);

  // navigasi ke halaman hasil
  const handleGenreClick = (mal_id, name) => {
    const params = new URLSearchParams();
    params.append("genres", mal_id);
    router.push(`/genre/result?${params.toString()}`);
  };

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-white text-lg">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 py-20">
        {/* Header Section */}
        <section className="relative py-12 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-[#FF6363] rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                  BROWSE GENRES
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                Discover {allGenres.length} anime genres, themes, and
                demographics
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            {error && (
              <div className="text-center py-8 mb-8">
                <div className="text-[#FF6363] text-lg font-semibold mb-2">
                  {error}
                </div>
                <p className="text-white/60">
                  Failed to load genres. Please try refreshing the page.
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-[#543864]/40 rounded-xl"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0f0f1f] border border-[#543864] rounded-2xl p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FiGrid className="text-[#FF6363] text-xl" />
                  <h2 className="text-2xl font-black text-white">
                    ALL GENRES ({allGenres.length})
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {allGenres.map((g) => (
                    <button
                      key={g.mal_id}
                      onClick={() => handleGenreClick(g.mal_id, g.name)}
                      className="bg-gradient-to-r from-[#543864] to-[#1a1a2f] border border-[#543864] text-white p-4 rounded-xl hover:border-[#FFBD69] hover:scale-105 transition-all duration-300 text-center group"
                    >
                      <FiTag className="text-[#FFBD69] text-lg mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <div className="font-semibold text-sm md:text-base">
                        {g.name}
                      </div>
                      <div className="text-white/60 text-xs mt-1">
                        {g.count || 0} anime
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-gradient-to-r from-[#543864] to-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <FiTag className="text-[#FFBD69] text-3xl mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">
                ANIME GENRES
              </h3>
              <p className="text-white/70 mb-6">
                Explore thousands of anime organized by genre, theme, and
                demographic. From action-packed adventures to heartwarming
                romances, find exactly what you&apos;re looking for with our
                comprehensive genre catalog.
              </p>
              <div className="text-white/40 text-sm">
                Genre data provided by Jikan API • Updated regularly
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
