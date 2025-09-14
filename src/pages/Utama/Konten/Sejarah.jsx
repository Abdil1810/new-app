import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import CardSejarah from "../../../components/Awal/CardSejarah";
import SidebarStyle from "../../../components/StyleKonten/SidebarStyle";
import TopbarStyle from "../../../components/StyleKonten/TopbarStyle";

const Sejarah = () => {
  const [sejarah, setSejarah] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [selectedWaktu, setSelectedWaktu] = useState("Semua");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSejarah = async () => {
      try {
        const snapshot = await getDocs(collection(db, "sejarah"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSejarah(data);
      } catch (error) {
        console.error("Gagal mengambil data sejarah:", error);
      }
    };

    fetchSejarah();
  }, []);

  const sejarahTersaring = sejarah
    .filter((item) =>
      item.judul?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (item) =>
        selectedKategori === "Semua" || item.kategori === selectedKategori
    )
    .filter((item) => {
      if (selectedWaktu === "Semua") return true;
      const now = new Date();
      const createdAt = new Date(item.createdAt?.seconds * 1000);
      const diffTime = now - createdAt;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (selectedWaktu === "24 Jam Terakhir") return diffDays <= 1;
      if (selectedWaktu === "7 Hari Terakhir") return diffDays <= 7;
      if (selectedWaktu === "30 Hari Terakhir") return diffDays <= 30;
      return true;
    });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <SidebarStyle
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col">
        <TopbarStyle
          toggleSidebar={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedKategori={selectedKategori}
          setSelectedKategori={setSelectedKategori}
          selectedWaktu={selectedWaktu}
          setSelectedWaktu={setSelectedWaktu}
        />

        {/* Grid Sejarah */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-24">
          <div className="max-w-7xl mx-auto">
            {sejarahTersaring.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sejarahTersaring.map((item) => (
                  <CardSejarah key={item.id} data={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <p className="text-lg font-medium">Tidak ada sejarah ditemukan</p>
                <p className="text-sm">Coba gunakan pencarian atau filter lain.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sejarah;