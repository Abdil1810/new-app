// src/components/Awal/Dropdown.jsx
import { useState, useRef, useEffect } from "react";
import { FiUser, FiEdit2, FiLogOut, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const Dropdown = ({ uid }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });
    return () => unsub();
  }, [uid]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative mt-2" // kasih margin top agar tidak terlalu dekat dengan topbar
      ref={dropdownRef}
    >
      <button
        onClick={handleToggle}
        className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-yellow-300 focus:outline-none"
      >
        {userData?.photoURL ? (
          <img
            src={userData.photoURL}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-white font-bold uppercase">
            {userData?.displayName?.[0] || "U"}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiUser /> {userData?.displayName || "Pengguna"}
              </p>
              <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
            </div>
            <ul className="text-sm">
              <li className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                <FiAward /> Poin: {userData?.poin || 0}
              </li>
              <li
                onClick={() => navigate("/edit-profil")}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              >
                <FiEdit2 /> Edit Profil
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-red-50 cursor-pointer text-red-600 flex items-center gap-2"
              >
                <FiLogOut /> Logout
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;