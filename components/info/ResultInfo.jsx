import React from "react";

export default function ResultInfo({
  startIndex,
  endIndex,
  totalItems,
  extra,
  className = "",
}) {
  return (
    <div className={`text-center lg:text-right ${className}`}>
      <div className="text-white/70 text-sm font-medium">
        Showing{" "}
        <span className="text-[#FFBD69] font-bold">
          {startIndex}-{endIndex}
        </span>{" "}
        of <span className="text-[#FF6363] font-bold">{totalItems}</span> anime
      </div>
      {extra && <div className="text-white/40 text-xs mt-1 capitalize">{extra}</div>}
    </div>
  );
}
