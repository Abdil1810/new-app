import { useState } from "react";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

export default function TukarPoinCard({ reward }) {
  const user = auth.currentUser;
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nohp: "",
    bank: "",
    norek: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRedeem = async () => {
    if (!user) return alert("Login dulu untuk menukar poin");

    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) return alert("Data user tidak ditemukan");

      const userData = userSnap.data();

      const pendingSnap = await getDocs(
        query(
          collection(db, "redeem"),
          where("userId", "==", user.uid),
          where("status", "==", "pending")
        )
      );

      if (!pendingSnap.empty) return alert("Silakan tunggu transaksi sebelumnya");
      if (userData.poin < reward.poin) return alert("Poin kamu tidak cukup");

      setShowForm(true);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  const handleSubmitForm = async () => {
    try {
      const transaksiId = uuidv4();
      await setDoc(doc(db, "redeem", transaksiId), {
        userId: user.uid,
        rewardId: reward.id,
        rewardName: reward.nama,
        poinDipakai: reward.poin,
        ...formData,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Penukaran berhasil diajukan! Menunggu verifikasi admin.");
      setShowForm(false);
      setFormData({ nama: "", nohp: "", bank: "", norek: "" });
    } catch (error) {
      console.error(error);
      alert("Gagal menukar poin, coba lagi.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[300px] sm:max-w-[320px] md:max-w-[350px]"
      >
        <div
          className="h-44 sm:h-48 md:h-52 rounded-2xl shadow-lg overflow-hidden relative
                     flex flex-col justify-between p-4 text-white
                     transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${reward.imageUrl})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl"></div>

          {/* Konten */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold truncate">{reward.nama}</h3>
              <p className="text-sm sm:text-base font-bold mt-1">{reward.poin} Poin</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRedeem}
                className="bg-white text-yellow-700 font-semibold px-4 py-1 rounded-lg text-sm shadow hover:bg-gray-100 transition"
              >
                Tukar
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Form Penukaran
            </h2>

            <input
              type="text"
              name="nama"
              placeholder="Nama Lengkap"
              value={formData.nama}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="nohp"
              placeholder="No HP"
              value={formData.nohp}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="bank"
              placeholder="Bank / E-Wallet"
              value={formData.bank}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="norek"
              placeholder="Nomor Rekening / E-Wallet"
              value={formData.norek}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <button
                onClick={handleSubmitForm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Kirim
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
