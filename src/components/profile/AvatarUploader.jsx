// src/components/profile/AvatarUploader.jsx
import React, { useRef } from "react";

export default function AvatarUploader({
  currentAvatar,
  displayName,
  onUpload,
  onRemove,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar preview */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400">
        <img
          src={currentAvatar || "/default-avatar.png"}
          alt={displayName || "Avatar"}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Ganti Foto
        </button>
        {currentAvatar && (
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            onClick={onRemove}
          >
            Hapus
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files[0]) {
            onUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
