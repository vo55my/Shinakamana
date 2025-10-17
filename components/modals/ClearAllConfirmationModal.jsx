import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

export default function ClearAllConfirmationModal({
  open,
  playlistCount,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2f] border border-[#543864] rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FiAlertTriangle className="text-[#FFBD69]" />
            Clear Entire Playlist
          </h3>
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white/70 mb-3">
            Are you sure you want to clear your entire playlist? This action
            will remove all{" "}
            <strong className="text-[#FFBD69]">{playlistCount} anime</strong>{" "}
            from your collection.
          </p>
          <p className="text-white/50 text-sm">
            This action cannot be undone. All your saved anime will be
            permanently deleted.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-[#FF6363] text-white rounded-lg hover:bg-[#ff5252] transition-colors duration-300 font-medium"
          >
            Clear All ({playlistCount} anime)
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
