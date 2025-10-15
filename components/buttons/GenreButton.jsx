import React from "react";
import { FiTag } from "react-icons/fi";

export default function GenreButton({ name, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-[#543864] to-[#1a1a2f] border border-[#543864] text-white p-4 rounded-xl hover:border-[#FFBD69] hover:scale-105 transition-all duration-300 text-center group"
    >
      <FiTag className="text-[#FFBD69] text-lg mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
      <div className="font-semibold text-sm md:text-base">{name}</div>
      <div className="text-white/60 text-xs mt-1">{count || 0} anime</div>
    </button>
  );
}
