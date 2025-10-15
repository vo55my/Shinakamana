import React from "react";
import { FiChevronUp } from "react-icons/fi";

export default function ScrollToTopButton({ show, onClick }) {
  if (!show) return null;
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-[#0f0f1f] p-3 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 z-50"
      aria-label="Scroll to top"
    >
      <FiChevronUp size={20} />
    </button>
  );
}
