"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAnimeGenres } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import GenreButton from "@/components/buttons/GenreButton";
import PageHeader from "@/components/common/PageHeader";
import InfoSection from "@/components/info/InfoSection";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import SSRLoadingFallback from "@/components/common/SSRLoadingFallback";
import { FiTag, FiGrid } from "react-icons/fi";

export default function GenrePage() {
  const router = useRouter();
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

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

  // Scroll button
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setShowScroll(window.scrollY > 400);
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!isClient) {
    return <SSRLoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 pt-15">
        {/* Header Section */}
        <PageHeader
          title="BROWSE GENRES"
          subtitle={`Discover ${allGenres.length} anime genres, themes, and demographics`}
          icon={<FiTag className="text-[#FF6363] text-2xl" />}
          color="#FF6363"
        />

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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {allGenres.map((g) => (
                    <GenreButton
                      key={g.mal_id}
                      name={g.name}
                      count={g.count}
                      onClick={() => handleGenreClick(g.mal_id, g.name)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <InfoSection
          icon={<FiTag className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
          title="ANIME GENRES"
          description="Explore thousands of anime organized by genre, theme, and demographic. From action-packed adventures to heartwarming romances, find exactly what you're looking for with our comprehensive genre catalog."
          note="Genre data provided by Jikan API • Updated regularly"
        />
      </main>

      {/* Scroll to top */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
