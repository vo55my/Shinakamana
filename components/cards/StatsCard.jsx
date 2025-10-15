import React from "react";

export default function StatsCard({ icon, value, label, color = "#FF6363" }) {
  return (
    <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl p-4 text-center">
      <div className="mx-auto mb-2" style={{ color }}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
  );
}
