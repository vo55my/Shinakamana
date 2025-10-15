import React from "react";

export default function EmptyState({ icon, title, description, actions }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-6 opacity-50">{icon}</div>
      <h3 className="text-2xl font-bold text-white/80 mb-4">{title}</h3>
      <p className="text-white/60 mb-8 max-w-md mx-auto">{description}</p>
      {actions && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {actions}
        </div>
      )}
    </div>
  );
}
