import React from "react";

export default function LoadingSkeleton({
  count = 10,
  type = "card",
  className = "",
}) {
  if (type === "rank") {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-24 bg-[#543864]/40 rounded-xl"></div>
        ))}
      </div>
    );
  }
  // default: card
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-48 bg-[#543864]/40 rounded-xl"></div>
      ))}
    </div>
  );
}
