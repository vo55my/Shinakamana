"use client";

import Link from "next/link";
import EmptyState from "@/components/state/EmptyState";
import { FiFolder, FiPlay, FiStar } from "react-icons/fi";

export default function PlaylistEmptyState() {
  return (
    <EmptyState
      icon={
        <FiFolder className="text-[#FFBD69] text-6xl mx-auto mb-6 opacity-50" />
      }
      title="Your playlist is empty"
      description="Start building your personal anime collection by adding shows you want to watch or have enjoyed."
      actions={
        <>
          <Link
            href="/genre"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FF6363] text-white rounded-lg hover:bg-[#ff5252] transition-colors duration-300"
          >
            <FiPlay className="text-sm" />
            <span>Browse Genres</span>
          </Link>
          <Link
            href="/top"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#543864] text-white rounded-lg hover:bg-[#4a3157] transition-colors duration-300"
          >
            <FiStar className="text-sm" />
            <span>Explore Top Anime</span>
          </Link>
        </>
      }
    />
  );
}
