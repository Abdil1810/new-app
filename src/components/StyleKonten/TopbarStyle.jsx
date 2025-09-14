// src/components/StyleKonten/TopbarStyle.jsx
import { useLocation } from "react-router-dom";
import { FiMenu, FiSearch } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import Dropdown from "../Awal/Dropdown";

import SearchbarBerita from "../KategoriBerita/SearchbarBerita";
import SearchbarPengetahuan from "../KategoriPengetahuan/SearchbarPengetahuan";
import SearchbarSejarah from "../KategoriSejarah/SearchbarSejarah";

const TopbarStyle = ({
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  selectedKategori,
  setSelectedKategori,
  selectedWaktu,
  setSelectedWaktu,
}) => {
  const location = useLocation();

  const isBerita = location.pathname.includes("/berita");
  const isPengetahuan = location.pathname.includes("/pengetahuan");
  const isSejarah = location.pathname.includes("/sejarah");

  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid || null;

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between gap-4 px-4 md:px-8 py-3 backdrop-blur-lg bg-white/30">
      {/* Tombol Sidebar */}
      <button
        className="text-2xl text-gray-800 drop-shadow hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FiMenu />
      </button>

      {/* Searchbar Tengah */}
      <div className="flex items-center flex-1 max-w-xl md:max-w-3xl mx-4 border border-gray-300 rounded-full px-4 py-2 bg-white/90 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
        <FiSearch className="text-gray-500 mr-3" size={20} />

        {isBerita && (
          <SearchbarBerita
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedKategori={selectedKategori}
            setSelectedKategori={setSelectedKategori}
            selectedWaktu={selectedWaktu}
            setSelectedWaktu={setSelectedWaktu}
          />
        )}

        {isPengetahuan && (
          <SearchbarPengetahuan
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedKategori={selectedKategori}
            setSelectedKategori={setSelectedKategori}
            selectedWaktu={selectedWaktu}
            setSelectedWaktu={setSelectedWaktu}
          />
        )}

        {isSejarah && (
          <SearchbarSejarah
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedKategori={selectedKategori}
            setSelectedKategori={setSelectedKategori}
            selectedWaktu={selectedWaktu}
            setSelectedWaktu={setSelectedWaktu}
          />
        )}
      </div>

      {/* User Dropdown */}
      <div className="drop-shadow">
        <Dropdown uid={uid} />
      </div>
    </header>
  );
};

export default TopbarStyle;