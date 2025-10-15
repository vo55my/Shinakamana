import React from "react";

export default function InfoSection({ icon, title, description, note }) {
  return (
    <section className="py-12 bg-gradient-to-r from-[#543864] to-[#1a1a2f]">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          {icon}
          <h3 className="text-2xl font-black text-white mb-4">{title}</h3>
          <p className="text-white/70 mb-6">{description}</p>
          {note && <div className="text-white/40 text-sm">{note}</div>}
        </div>
      </div>
    </section>
  );
}
