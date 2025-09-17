import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiBookOpen, FiHome, FiTarget, FiGift, FiSettings, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const menuItems = [
  { icon: <FiHome />, label: "Home", path: "/Home" },
  { icon: <FiTarget />, label: "Misi", path: "/Misi" },
  { icon: <FiGift />, label: "Tukar Poin", path: "/TukarPoin" }, // <- nanti tambahin routingnya 
  { icon: <FiSettings />, label: "Pengaturan", path: "/Pengaturan" },
  { icon: <FiBookOpen />, label: "Syarat & Ketentuan", path: "/Syarat" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose(); // Tutup sidebar juga
      navigate("/"); // Arahkan ke landing/home
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
            onClick={onClose}
          />

          {/* Sidebar Slide-in */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-6 flex flex-col"
          >
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button onClick={onClose} className="text-2xl text-gray-700">
                <FiX />
              </button>
            </div>

            {/* Logo or Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Dawnlessday</h2>

            {/* Menu Items */}
            <nav className="flex flex-col gap-4">
              {menuItems.map((item, index) => (
                <Link
                  to={item.path}
                  key={index}
                  onClick={onClose}
                  className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}

              {/* Logout item */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                <span className="text-xl">
                  <FiLogOut />
                </span>
                Logout
              </button>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;