import React from "react";

export default function PageHeader({
  title,
  subtitle,
  icon,
  color = "#FF6363",
}) {
  return (
    <section className="relative py-12 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {icon}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-white/70 text-lg max-w-2xl capitalize">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
