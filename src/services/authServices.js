// src/services/authServices.js
import { getAuth, sendPasswordResetEmail, verifyBeforeUpdateEmail } from "firebase/auth";

export async function sendResetPasswordEmail(email) {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Reset password failed:", error);
    throw error;
  }
}

// Request perubahan email dengan verifikasi
export async function requestEmailChange(newEmail) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");
  try {
    await verifyBeforeUpdateEmail(user, newEmail);
    return true;
  } catch (error) {
    console.error("Email change request failed:", error);
    throw error;
  }
}