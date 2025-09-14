import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiMenu, FiSearch } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import Dropdown from "../Awal/Dropdown";

// Komponen dinamis sesuai halaman
import SearchbarBerita from "../KategoriBerita/SearchbarBerita";
import KategoriBerita from "../KategoriBerita/KategoriBerita";
import FilterWaktuBerita from "../KategoriBerita/FilterWaktuBerita";

import SearchbarPengetahuan from "../KategoriPengetahuan/SearchbarPengetahuan";
import KategoriPengetahuan from "../KategoriPengetahuan/KategoriPengetahuan";
import FilterWaktuPengetahuan from "../KategoriPengetahuan/FilterWaktuPengetahuan";

import SearchbarSejarah from "../KategoriSejarah/SearchbarSejarah";
import KategoriSejarah from "../KategoriSejarah/KategoriSejarah";
import FilterWaktuSejarah from "../KategoriSejarah/FilterWaktuSejarah";

const Topbar = ({ toggleSidebar }) => {
  const location = useLocation();

  const isBerita = location.pathname.includes("/berita");
  const isPengetahuan = location.pathname.includes("/pengetahuan");
  const isSejarah = location.pathname.includes("/sejarah");

  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid || null;

  useEffect(() => {
    if (!uid) return;
  }, [uid]);

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center gap-4 px-4 md:px-8 py-3 bg-transparent">
      {/* Tombol Sidebar */}
      <button
        className="text-2xl text-gray-800 dark:text-gray-200 hover:text-blue-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FiMenu />
      </button>

      {/* Filter & Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0 overflow-x-auto">
        {isBerita && (
          <>
            <div className="flex items-center flex-1 max-w-xl md:max-w-3xl 
                            border border-gray-300 rounded-full px-4 py-2 
                            bg-white/20 shadow-sm 
                            focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
              <FiSearch className="text-gray-500 mr-3" size={20} />
              <SearchbarBerita />
            </div>
            <KategoriBerita />
            <FilterWaktuBerita />
          </>
        )}

        {isPengetahuan && (
          <>
            <div className="flex items-center flex-1 max-w-xl md:max-w-3xl 
                            border border-gray-300 rounded-full px-4 py-2 
                            bg-white/20 shadow-sm 
                            focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
              <FiSearch className="text-gray-500 mr-3" size={20} />
              <SearchbarPengetahuan />
            </div>
            <KategoriPengetahuan />
            <FilterWaktuPengetahuan />
          </>
        )}

        {isSejarah && (
          <>
            <div className="flex items-center flex-1 max-w-xl md:max-w-3xl 
                            border border-gray-300 rounded-full px-4 py-2 
                            bg-white/20 shadow-sm 
                            focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
              <FiSearch className="text-gray-500 mr-3" size={20} />
              <SearchbarSejarah />
            </div>
            <KategoriSejarah />
            <FilterWaktuSejarah />
          </>
        )}
      </div>

      {/* Dropdown User */}
      <div className="ml-auto flex-shrink-0">
        <Dropdown uid={uid} />
      </div>
    </header>
  );
};

export default Topbar;