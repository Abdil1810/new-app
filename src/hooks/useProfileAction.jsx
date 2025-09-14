import { useState } from "react";
import {
  getAuth,
  updateProfile,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase/firebaseConfig";

export default function useProfileAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authInstance = getAuth();

  // Upload avatar
  const uploadAvatar = async (file) => {
    if (!file) return false;
    setLoading(true);
    setError(null);

    try {
      const user = authInstance.currentUser;
      if (!user) throw new Error("User tidak login");

      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photoURL: downloadURL });

      setLoading(false);
      return downloadURL;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Hapus avatar
  const removeAvatar = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = authInstance.currentUser;
      if (!user) throw new Error("User tidak login");

      const storageRef = ref(storage, `avatars/${user.uid}`);
      await deleteObject(storageRef);

      await updateProfile(user, { photoURL: null });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photoURL: null });

      setLoading(false);
      return true;
    } catch (err) {
      try {
        const user = authInstance.currentUser;
        await updateProfile(user, { photoURL: null });
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { photoURL: null });
      } catch {}
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Ubah profil (nama + bio)
  const updateProfileData = async ({ displayName, bio }) => {
    setLoading(true);
    setError(null);
    try {
      const user = authInstance.currentUser;
      if (!user) throw new Error("User tidak login");

      await updateProfile(user, { displayName });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { displayName, bio });

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Kirim reset password
  const sendResetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(authInstance, email);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Ubah email (dengan reauth)
  const requestEmailChange = async (newEmail, currentPassword) => {
    setLoading(true);
    setError(null);
    try {
      const user = authInstance.currentUser;
      if (!user) throw new Error("User tidak login");

      // Reauth user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Kirim email verifikasi ke alamat baru
      await verifyBeforeUpdateEmail(user, newEmail);

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    error,
    updateProfileData,
    uploadAvatar,
    removeAvatar,
    sendResetPassword,
    requestEmailChange,
  };
}