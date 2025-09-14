// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // tambah import storage

const firebaseConfig = {
  apiKey: "AIzaSyC5GFKhlT9z7ZwGf49MPbChUNa5jCdNLyc",
  authDomain: "dawnlessday-a75e2.firebaseapp.com",
  projectId: "dawnlessday-a75e2",
  storageBucket: "dawnlessday-a75e2.appspot.com",
  messagingSenderId: "798491266304",
  appId: "1:798491266304:web:ebbb5d3150ff4ba626f7e5",
  measurementId: "G-RER5X9N6GE"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);  // inisialisasi storage

export { auth, db, storage };