import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1000); // tampil 1 detik
    const cleanup = setTimeout(() => navigate("/home"), 1500); // setelah fade out

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      } bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]`}
    >
      <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wide animate-pulse">
        Dawnlessday
      </h1>
    </div>
  );
};

export default SplashScreen;