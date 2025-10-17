"use client";

import { Suspense } from "react";
import ResultLoading from "@/components/common/ResultLoading";
import SeasonResultContent from "@/components/section/season/SeasonResultContent";
import { FiPlay } from "react-icons/fi";

// Komponen utama dengan Suspense boundary
export default function SeasonResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading
          title="SEASON RESULTS"
          icon={<FiPlay className="text-[#FF6363] text-lg" />}
        />
      }
    >
      <SeasonResultContent />
    </Suspense>
  );
}
