"use client";

import { Suspense } from "react";
import ResultLoading from "@/components/common/ResultLoading";
import GenreResultContent from "@/components/section/genre/GenreResultContent";
import { FiTag } from "react-icons/fi";

// Komponen utama dengan Suspense boundary
export default function GenreResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading
          title="GENRES RESULTS"
          icon={<FiTag className="text-[#FF6363] text-lg" />}
        />
      }
    >
      <GenreResultContent />
    </Suspense>
  );
}
