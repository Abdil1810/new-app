// src/pages/Utama/Misi/DetailMisi.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const DetailMisi = () => {
  const { id } = useParams(); // id misi dari URL
  const navigate = useNavigate();
  const [misi, setMisi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tombolAktif, setTombolAktif] = useState(false);
  const [sudahSelesai, setSudahSelesai] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [processing, setProcessing] = useState(false); // 🔥 anti-spam

  const auth = getAuth();

  // cek auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIdUser(user.uid);
      } else {
        setIdUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // ambil data misi
  useEffect(() => {
    const fetchMisi = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, "missions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMisi({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Misi tidak ditemukan");
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat misi");
      } finally {
        setLoading(false);
      }
    };
    fetchMisi();
  }, [id]);

  // cek progress user
  useEffect(() => {
    if (!idUser || !misi) return;

    const cekProgress = async () => {
      try {
        const userRef = doc(db, "users", idUser);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const progress = data.progress?.[id];
          const sudah = data.misiSelesai?.includes(id);

          if (sudah || progress?.selesai) {
            setSudahSelesai(true);
            return;
          }

          if (progress) {
            const { startTime, durasi } = progress;
            if (Date.now() - startTime >= durasi * 1000) {
              setTombolAktif(true);
            }
          }
        }
      } catch (err) {
        console.error("Gagal cek progress:", err);
      }
    };

    cekProgress();
  }, [idUser, id, misi]);

// buka detail konten (berita / pengetahuan / sejarah)
const handleGetStarted = async () => {
  if (!idUser) {
    toast.error("User belum login");
    return;
  }
  if (!misi?.idBerita && !misi?.idPengetahuan && !misi?.idSejarah) {
    toast.error("ID konten tidak ditemukan di misi ini");
    return;
  }

  try {
    const userRef = doc(db, "users", idUser);

    // simpan progress user
    await updateDoc(userRef, {
      [`progress.${id}`]: {
        startTime: Date.now(),
        durasi: misi.durasi || 30,
        selesai: false,
      },
    });

    // tentukan route berdasarkan field yang ada
    let route = "";
    if (misi.idBerita) {
      route = `/utama/detailberita/${misi.idBerita}?from=mission&misi=${id}`;
    } else if (misi.idPengetahuan) {
      route = `/utama/detailpengetahuan/${misi.idPengetahuan}?from=mission&misi=${id}`;
    } else if (misi.idSejarah) {
      route = `/utama/detailsejarah/${misi.idSejarah}?from=mission&misi=${id}`;
    } else {
      toast.error("Misi tidak memiliki target konten");
      return;
    }

    navigate(route);
  } catch (err) {
    console.error("Gagal memulai misi:", err);
    toast.error("Gagal memulai misi");
  }
};

  // tandai selesai
  const handleTandaiSelesai = async () => {
    if (processing) return; // 🚫 cegah spam klik
    setProcessing(true);

    try {
      if (sudahSelesai) {
        toast.info("Misi ini sudah ditandai selesai");
        setProcessing(false);
        return;
      }
      if (!tombolAktif) {
        toast.info("Selesaikan misi terlebih dahulu");
        setProcessing(false);
        return;
      }
      if (!idUser) {
        toast.error("User belum login");
        setProcessing(false);
        return;
      }

      const userRef = doc(db, "users", idUser);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error("User tidak ditemukan.");

      const userData = userSnap.data();

      // 🚫 cek ulang biar aman
      if (userData.misiSelesai?.includes(id)) {
        toast.info("Misi ini sudah pernah selesai");
        setProcessing(false);
        return;
      }

      // ✅ Update poin & misi selesai
      await updateDoc(userRef, {
        poin: increment(misi.poinMisi || 0),
        misiSelesai: arrayUnion(id),
        [`progress.${id}.selesai`]: true,
      });

      // ✅ Tambah history
      await addDoc(collection(db, "pointsHistory"), {
        userId: idUser,
        misiId: id,
        poin: misi.poinMisi || 0,
        timestamp: serverTimestamp(),
        type: "mission_complete",
      });

      setSudahSelesai(true);
      toast.success(`Misi selesai! +${misi.poinMisi} poin`);
      navigate("/awal");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menandai selesai");
    } finally {
      setProcessing(false); // 🔓 aktifkan tombol lagi
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!misi) return <p className="text-center mt-10">Misi tidak ditemukan</p>;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 md:h-96">
        <img
          src={misi.gambarMisi || "/default-mission.jpg"}
          alt={misi.namaMisi}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center px-4"
          >
            {misi.namaMisi}
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto -mt-12 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 space-y-6"
      >
        <p className="text-gray-700 text-lg">{misi.deskripsi}</p>

        {/* Panduan */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Panduan Misi</h2>
          <ol className="space-y-3">
            {[
              "Klik tombol Get Started",
              "Baca berita yang ditampilkan",
              "Kembali ke halaman misi",
              "Klik tombol Tandai Selesai untuk klaim poin",
            ].map((step, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.4 }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                  {index + 1}
                </span>
                <span className="text-gray-600">{step}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Info poin */}
        {misi.poinMisi && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              Poin yang akan didapat:{" "}
              <span className="font-bold">{misi.poinMisi}</span>
            </p>
          </div>
        )}

        {/* Tombol */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Get Started
          </motion.button>

          <motion.button
            whileTap={{ scale: !sudahSelesai && tombolAktif ? 0.95 : 1 }}
            onClick={handleTandaiSelesai}
            disabled={sudahSelesai || !tombolAktif || processing}
            className={`px-6 py-3 font-semibold rounded-lg shadow transition 
              ${
                sudahSelesai
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : processing
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : tombolAktif
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {processing
              ? "Memproses..."
              : sudahSelesai
              ? "Misi Selesai"
              : "Tandai Selesai"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DetailMisi;