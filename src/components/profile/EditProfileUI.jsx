// src/components/profile/EditProfileUI.jsx
import React, { useState } from "react";
import AvatarUploader from "./AvatarUploader";
import { FiArrowLeft } from "react-icons/fi";

export default function EditProfileUI({
  data = {},
  onChange = () => {},
  onUpload = () => {},
  onRemove = () => {},
  onRequestEmailChange = () => {},
  onRequestPasswordReset = () => {},
  onSave = () => {},
  isSaving = false,
  hasChanges = false,
  title = "Ruang Saya",
  subtitle = "Perbarui informasi akun Anda",
  onBack = () => {}, // 🔹 tetap props
}) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const handleEmailChangeSubmit = (e) => {
    e.preventDefault();
    onRequestEmailChange(newEmail, currentPassword);
    setShowEmailModal(false);
    setNewEmail("");
    setCurrentPassword("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      {/* HEADER */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </header>

      {/* AVATAR */}
      <div className="mb-6 flex justify-center">
        <AvatarUploader
          currentAvatar={data.photoURL}
          displayName={data.displayName}
          onUpload={onUpload}
          onRemove={onRemove}
        />
      </div>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSaving && hasChanges) onSave();
        }}
        className="space-y-6"
      >
        {/* NAMA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={data.displayName || ""}
            onChange={(e) => onChange("displayName", e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            placeholder="Nama yang tampil di situs"
          />
        </div>

        {/* NO HP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor HP
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-600">
              +62
            </span>
            <input
              type="tel"
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="81234567890"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="email"
              value={data.email || ""}
              readOnly
              disabled
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50"
            >
              Ubah Email
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Email hanya bisa diubah lewat proses verifikasi.
          </p>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="password"
              value={""}
              readOnly
              disabled
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
            />
            <button
              type="button"
              onClick={onRequestPasswordReset}
              className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Klik Reset untuk mengirim email reset password.
          </p>
        </div>

        {/* BIO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={data.bio || ""}
            onChange={(e) => onChange("bio", e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            rows={4}
            placeholder="Ceritakan sedikit tentang diri Anda..."
          />
        </div>

        {/* TOMBOL SIMPAN */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={!hasChanges || isSaving}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-sm transition-all ${
              !hasChanges || isSaving
                ? "bg-yellow-200 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          {/* 🔹 Tombol kembali di bawah */}
          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <FiArrowLeft className="text-lg" />
            Kembali
          </button>
        </div>
      </form>

      {/* MODAL UBAH EMAIL */}
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Ubah Email</h2>
            <form onSubmit={handleEmailChangeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Baru
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Kirim Verifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}