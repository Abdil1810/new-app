// src/services/profileServices.js
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function updateUserProfile({ displayName, phone, bio }) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  try {
    // Update Firebase Auth displayName
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Update Firestore data
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { displayName, phone, bio });
  } catch (error) {
    console.error("Update profile failed:", error);
    throw error;
  }
}
