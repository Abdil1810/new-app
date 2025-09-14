// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Tambahan
import EditProfileUI from "../../components/profile/EditProfileUI";
import useProfileData from "../../hooks/useProfileData";
import useProfileActions from "../../hooks/useProfileAction";
import { updateUserProfile } from "../../services/profileServices";
import { sendResetPasswordEmail } from "../../services/authServices";

export default function EditProfile() {
  const navigate = useNavigate(); // ⬅️ Tambahan
  const { userData, loading } = useProfileData();
  const {
    uploadAvatar,
    removeAvatar,
    requestEmailChange,
    loading: actionLoading,
  } = useProfileActions();

  const [data, setData] = useState({
    displayName: "",
    phone: "",
    email: "",
    bio: "",
    photoURL: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (userData) {
      setData({
        displayName: userData.displayName || "",
        phone: userData.phone || "",
        email: userData.email || "",
        bio: userData.bio || "",
        photoURL: userData.photoURL || "",
      });
      setHasChanges(false);
    }
  }, [userData]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleUpload = async (file) => {
    try {
      const downloadURL = await uploadAvatar(file);
      if (downloadURL) {
        const uniqueURL = downloadURL + "?t=" + new Date().getTime();
        setData((prev) => ({ ...prev, photoURL: uniqueURL }));
        setHasChanges(true);
      } else {
        alert("Gagal upload avatar");
      }
    } catch (e) {
      console.error(e);
      alert("Gagal upload avatar");
    }
  };

  const handleRemove = async () => {
    try {
      await removeAvatar();
      setData((prev) => ({ ...prev, photoURL: "" }));
      setHasChanges(true);
    } catch {
      alert("Gagal hapus avatar");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName: data.displayName,
        phone: data.phone,
        bio: data.bio,
      });
      setHasChanges(false);
      alert("Profil berhasil diperbarui");
    } catch {
      alert("Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestEmailChange = async () => {
    const newEmail = prompt("Masukkan email baru:");
    if (!newEmail) return;

    const currentPassword = prompt("Masukkan password saat ini:");
    if (!currentPassword) return;

    const success = await requestEmailChange(newEmail, currentPassword);
    if (success) {
      alert(
        "Link verifikasi telah dikirim ke email baru. Silakan cek inbox untuk mengonfirmasi."
      );
    } else {
      alert("Gagal mengubah email. Pastikan password benar.");
    }
  };

  const handleRequestPasswordReset = async () => {
    try {
      await sendResetPasswordEmail(data.email);
      alert("Email reset password sudah dikirim.");
    } catch {
      alert("Gagal mengirim email reset password.");
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading profil...</div>;

  return (
    <EditProfileUI
      data={data}
      onChange={handleChange}
      onUpload={handleUpload}
      onRemove={handleRemove}
      onSave={handleSave}
      isSaving={isSaving || actionLoading}
      hasChanges={hasChanges}
      onRequestEmailChange={handleRequestEmailChange}
      onRequestPasswordReset={handleRequestPasswordReset}
      onBack={() => navigate(-1)} // ⬅️ Tombol kembali
    />
  );
}