import { useState } from "react";
import { 
  doc, setDoc, serverTimestamp, updateDoc, increment, 
  collection, query, where, getDocs, getDoc 
} from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

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
    if (!user) {
      alert("Login dulu untuk menukar poin");
      return;
    }

    try {
      // 🔹 Ambil data user
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("Data user tidak ditemukan");
        return;
      }

      const userData = userSnap.data();

      // 🔹 Cek transaksi pending
      const q = query(
        collection(db, "redeem"),
        where("userId", "==", user.uid),
        where("status", "==", "pending")
      );
      const pendingSnap = await getDocs(q);
      if (!pendingSnap.empty) {
        alert("Silakan tunggu transaksi Anda Sebelumnya");
        return;
      }

      // 🔹 Cek poin cukup
      if (userData.poin < reward.poin) {
        alert("Poin kamu tidak cukup");
        return;
      }

      // 🔹 Lanjut bikin transaksi setelah isi form
      setShowForm(true);

    } catch (error) {
      console.error("Error cek user:", error);
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  const handleSubmitForm = async () => {
    try {
      const transaksiId = uuidv4();

      // Buat dokumen redeem
      await setDoc(doc(db, "redeem", transaksiId), {
        userId: user.uid,
        rewardId: reward.id,
        rewardName: reward.nama,
        poinDipakai: reward.poin,
        ...formData,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Kurangi poin user
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        poin: increment(-reward.poin),
      });

      alert("Penukaran berhasil diajukan! Menunggu verifikasi admin.");
      setShowForm(false);
      setFormData({ nama: "", nohp: "", bank: "", norek: "" });

    } catch (error) {
      console.error("Error redeem:", error);
      alert("Gagal menukar poin, coba lagi.");
    }
  };


  return (
    <>
      {/* Card Reward */}
      <div
        className="w-full max-w-[320px] aspect-[16/9]
                   bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-700
                   rounded-2xl shadow-lg overflow-hidden 
                   flex flex-col justify-between 
                   p-4 sm:p-5 text-white
                   transition-transform duration-300 
                   hover:scale-[1.05] hover:shadow-2xl"
      >
        {/* Bagian Atas */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg md:text-xl font-bold drop-shadow">
            {reward.nama}
          </h3>
          <p className="text-xs sm:text-sm md:text-base opacity-90">
            {reward.poin} Poin
          </p>
        </div>

        {/* Bagian Bawah */}
        <div className="flex justify-end">
          <button
            onClick={handleRedeem}
            className="bg-white text-yellow-700 font-semibold 
                       px-3 sm:px-4 py-1 sm:py-1.5 
                       rounded-lg text-xs sm:text-sm md:text-base 
                       shadow-md hover:bg-gray-100 transition"
          >
            Tukar
          </button>
        </div>
      </div>

      {/* Modal Form Penukaran */}
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
                className="flex-1 bg-green-600 hover:bg-green-700 
                           text-white px-4 py-2 rounded-lg"
              >
                Kirim
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 
                           text-white px-4 py-2 rounded-lg"
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