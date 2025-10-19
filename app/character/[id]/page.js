"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getCharacterFullById } from "@/lib/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import LoadingState from "@/components/state/LoadingState";
import ErrorState from "@/components/state/ErrorState";
import InfoSection from "@/components/info/InfoSection";
import CharacterDetailHeader from "@/components/section/character/CharacterDetailHeader";
import CharacterInfoSection from "@/components/section/character/CharacterInfoSection";
import CharacterAnimeSection from "@/components/section/character/CharacterAnimeSection";
import CharacterVoicesSection from "@/components/section/character/CharacterVoicesSection";
import { FiInfo } from "react-icons/fi";

export default function CharacterDetailPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  const mountedRef = useRef(true);

  // Cleanup mounted ref
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Scroll button handler
  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setShowScroll(window.scrollY > 400);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch character data
  useEffect(() => {
    if (!id) return;

    const fetchCharacterData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCharacterFullById(id);
        const characterData = response?.data ?? null;

        if (!mountedRef.current) return;
        setCharacter(characterData);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err?.message || "Failed to load character data");
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchCharacterData();
  }, [id]);

  // Invalid ID fallback
  if (!id) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white text-lg">Invalid Character ID</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />

      <main className="flex-1 pt-15">
        {/* Header */}
        <CharacterDetailHeader character={character} />

        {/* Loading State */}
        {loading && !error && <LoadingState />}

        {/* Error State */}
        {error && <ErrorState error={error} />}

        {/* Content */}
        {!loading && !error && character && (
          <>
            {/* Main Character Info */}
            <CharacterInfoSection character={character} />

            {/* Anime Appearances */}
            <CharacterAnimeSection animeography={character.anime} />

            {/* Voice Actors */}
            <CharacterVoicesSection voices={character.voices} />

            {/* Info Section */}
            <InfoSection
              icon={<FiInfo className="text-[#FFBD69] text-3xl mx-auto mb-4" />}
              title="CHARACTER DETAILS"
              description="Find detailed information about your favorite character, including background, appearances in anime, voice actors, and more."
              note="Data updated regularly from Jikan API"
            />
          </>
        )}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton show={showScroll} onClick={scrollToTop} />

      <Footer />
    </div>
  );
}
