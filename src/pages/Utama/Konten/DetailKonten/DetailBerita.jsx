// src/pages/DetailBerita.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import {
  Share2,
  Facebook,
  Twitter,
  Copy,
  Send,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const fromMission = query.get("from") === "mission";
  const idMisi = query.get("misi");

  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showShare, setShowShare] = useState(false);

  const currentUrl = window.location.href;

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const docRef = doc(db, "berita", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBerita(docSnap.data());
        }
      } catch (err) {
        console.error("Gagal mengambil berita:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBerita();
  }, [id]);

  // progress bar membaca
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress((scrolled / totalHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // fungsi share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: berita?.namaMisi || "Dawnlessday",
          text: "Coba baca berita ini di Dawnlessday!",
          url: currentUrl,
        });
      } catch (err) {
        console.log("Share dibatalkan:", err);
      }
    } else {
      setShowShare(!showShare);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Berita tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all"
        style={{ width: `${progress}%` }}
      />

      {/* Hero Gambar */}
      <div className="relative h-80 w-full">
        <img
          src={berita.gambarMisi}
          alt={berita.namaMisi}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col items-center justify-end pb-6">
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-white text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {berita.namaMisi}
          </motion.h1>
          <p className="text-gray-200 text-sm mt-2">
            {berita.tanggal?.seconds
              ? new Date(berita.tanggal.seconds * 1000).toLocaleDateString(
                  "id-ID"
                )
              : "Tanpa tanggal"}
          </p>
        </div>
      </div>

      {/* Konten */}
      <div className="max-w-3xl mx-auto px-5 py-10">
        {fromMission && (
          <div className="grid grid-cols-2 sm:flex gap-3 mb-8">
            <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
              ⭐ {berita.poinMisi} Poin
            </div>
            <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow">
              ⏱ {berita.durasi || 100} detik baca
            </div>
          </div>
        )}

        {/* Isi berita */}
        
<motion.div
  className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {berita.kontenBerita.split("\n").map((line, i) => (
    <p key={i}>{line}</p>
  ))}
</motion.div>

        {/* Tombol aksi */}
        <div className="mt-10 flex justify-between relative">
          <button
            onClick={() =>
              fromMission && idMisi
                ? navigate(`/utama/detailmisi/${idMisi}`)
                : navigate(-1)
            }
            className="px-5 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow transition"
          >
            ← Kembali
          </button>

          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              <Share2 size={18} /> Bagikan
            </button>

<AnimatePresence>
  {showShare && (
<motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 10, scale: 0.95 }}
  transition={{ duration: 0.2 }}
  className="absolute right-0 bottom-full mb-2 min-w-max bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
>
  <a
    href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <MessageCircle size={18} className="text-green-500" />
    <span>WhatsApp</span>
  </a>

  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <Facebook size={18} className="text-blue-600" />
    <span>Facebook</span>
  </a>

  <a
    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(berita?.namaMisi || "Coba baca berita ini!")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <Twitter size={18} className="text-sky-500" />
    <span>Twitter</span>
  </a>

  <a
    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(berita?.namaMisi || "Coba baca berita ini!")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <Send size={18} className="text-blue-500" />
    <span>Telegram</span>
  </a>

  <button
    onClick={() => {
      navigator.clipboard.writeText(currentUrl);
      alert("Link disalin!");
      setShowShare(false);
    }}
    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <Copy size={18} className="text-gray-500" />
    <span>Salin Link</span>
  </button>
</motion.div>
  )}
</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBerita;