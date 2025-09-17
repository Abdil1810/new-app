import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Google Redirect result
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate("/dashboard");
        }
      })
      .catch((err) => console.error("Redirect error:", err.message));
  }, [navigate]);

  // Handle daftar biasa
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update nama
      await updateProfile(userCredential.user, { displayName: nama });

      // Kirim email verifikasi
      await sendEmailVerification(userCredential.user);

      alert("Pendaftaran berhasil! Silakan cek email Di Spam untuk verifikasi akun.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle daftar Google
  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-100 to-white px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Daftar Akun Baru</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-yellow-300" : "bg-yellow-400 hover:bg-yellow-500"
            } text-white font-semibold py-2 rounded-lg transition`}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link to="/Login" className="text-yellow-600 hover:underline">
            Masuk di sini
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm text-gray-500">atau</span>
        </div>

        <button
          onClick={handleGoogleRegister}
          className="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Daftar dengan Google
        </button>
      </div>
    </div>
  );
}