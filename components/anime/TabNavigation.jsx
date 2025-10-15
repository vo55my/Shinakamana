import React from "react";

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-3 font-bold rounded-xl transition-all duration-300 border ${
            activeTab === tab.key
              ? "bg-gradient-to-r from-[#FF6363] to-[#FFBD69] text-[#0f0f1f] border-transparent"
              : "bg-[#1a1a2f] border-[#543864] text-white/80 hover:text-white hover:border-[#FF6363]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
