"use client";

export default function InfoRow({ label, value }) {
  if (!value || value === "N/A") return null;

  return (
    <div className="flex justify-between items-center py-2 gap-8 border-b border-[#543864]/50 capitalize">
      <span className="text-white/70 font-medium">{label}</span>
      <span className="text-white font-semibold text-right">{value}</span>
    </div>
  );
}
