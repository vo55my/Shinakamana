"use client";

import { Suspense } from "react";
import ResultLoading from "@/components/common/ResultLoading";
import { FiFilter } from "react-icons/fi";

// Import komponen yang sudah dipisah
import SearchResultContent from "@/components/section/search/SearchResultContent";

// Komponen utama dengan Suspense boundary
export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading
          title="SEARCH RESULTS"
          icon={<FiFilter className="text-[#FF6363] text-lg" />}
        />
      }
    >
      <SearchResultContent />
    </Suspense>
  );
}
