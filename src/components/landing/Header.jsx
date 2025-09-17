import { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  window.onscroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-yellow-700">Dawnlessday</div>

        <nav className="hidden md:flex space-x-9 text-sm font-medium text-yellow-900">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy & Policy</Link>
          <Link to="/insentif">Insentif</Link>
        </nav>
<div className="hidden md:flex space-x-4">
  <Link
    to="/Login"
    className="px-4 py-1 flex-5 bg-yellow-600 hover:bg-blue-700 text-white text-sm font-medium text-center py-2 rounded-lg transition"
                >
    MASUK
  </Link>
  <Link
    to="/Register"
    className="px-4 py-1 flex-1 bg-yellow-500 hover:bg-purple-700 text-white text-sm font-medium text-center py-2 rounded-lg transition"
                >
    DAFTAR
  </Link>
</div>
        {/* Dropdown di tampilan mobile */}
        <div className="md:hidden">
          <Dropdown />
        </div>
      </div>
    </header>
  );
}

