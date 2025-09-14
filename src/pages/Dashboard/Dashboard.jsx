import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Dashboard = () => {
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      // Simpan ke Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        displayName: nama,
        phone: noHp,
        email: user.email,
        uid: user.uid,
      });

      // Update profil di auth (biar Topbar langsung ikut berubah)
      await updateProfile(user, {
        displayName: nama,
      });

      navigate("/Awal");
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-200 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-xl transition-all duration-500">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6 text-center tracking-wide">
          Lengkapi Profil Anda
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="tel"
            placeholder="Nomor Handphone"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            required
            className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-yellow-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;