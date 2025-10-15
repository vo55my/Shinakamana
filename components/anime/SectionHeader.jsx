import React from "react";

// icon: React element, title: string, subtitle: string, color: tailwind color class
export default function SectionHeader({
  icon,
  title,
  subtitle,
  color = "#FF6363",
}) {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 md:mb-0">
      <div
        className={`w-2 h-8 sm:h-12`}
        style={{ background: color, borderRadius: "9999px" }}
      ></div>
      <div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white flex items-center space-x-2 sm:space-x-3">
          {icon}
          <span>{title}</span>
        </h2>
        {subtitle && (
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
