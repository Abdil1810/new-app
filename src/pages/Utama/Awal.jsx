// src/pages/Utama/Awal.jsx
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiBookOpen, FiGlobe, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

import Sidebar from "../../components/Awal/Sidebar";
import Topbar from "../../components/Awal/Topbar";

const Awal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="flex min-h-screen overflow-y-auto">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar toggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-yellow-50 via-white to-yellow-100 px-6 py-16 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-700 mb-4 animate-fade-in-up">
              Selamat Datang di Dawnlessday
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-12 max-w-2xl mx-auto animate-fade-in-up delay-100">
              Menjelajahi kebenaran, sejarah, dan pengetahuan dengan cara yang
              menyenangkan dan mendalam.
            </p>

            {/* 3 Menu Utama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
              <Link to="/berita" data-aos="fade-up">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                  <FiGlobe className="text-yellow-500 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                    Berita
                  </h3>
                  <p className="text-gray-600">
                    Berita terkini yang dikurasi, bukan sekadar sensasi. Temukan
                    kebenaran di balik layar dunia.
                  </p>
                </div>
              </Link>

              <Link to="/pengetahuan" data-aos="fade-up" data-aos-delay="150">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                  <FiBookOpen className="text-yellow-500 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                    Pengetahuan
                  </h3>
                  <p className="text-gray-600">
                    Meningkatkan wawasan dan logika melalui artikel sains,
                    teknologi, dan humaniora yang mendalam.
                  </p>
                </div>
              </Link>

              <Link to="/sejarah" data-aos="fade-up" data-aos-delay="300">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                  <FiClock className="text-yellow-500 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                    Sejarah
                  </h3>
                  <p className="text-gray-600">
                    Mengungkap kisah masa lalu yang terlupakan, dari sudut
                    pandang yang jujur dan terverifikasi.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Awal;