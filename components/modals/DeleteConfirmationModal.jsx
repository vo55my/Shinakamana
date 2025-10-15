import React from "react";
import { FiX } from "react-icons/fi";

export default function DeleteConfirmationModal({
  open,
  anime,
  onConfirm,
  onCancel,
}) {
  if (!open || !anime) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Remove from Playlist</h3>
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FiX className="text-lg" />
          </button>
        </div>
        <p className="text-white/70 mb-6">
          Are you sure you want to remove{" "}
          <strong className="text-[#FFBD69]">{anime.title}</strong> from your
          playlist?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => onConfirm(anime.mal_id)}
            className="flex-1 py-2 bg-[#FF6363] text-white rounded-lg hover:bg-[#ff5252] transition-colors duration-300"
          >
            Remove
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-[#543864] text-white rounded-lg hover:bg-[#4a3157] transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
