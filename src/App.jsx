import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import Login from "./pages/Masuk/Login";
import Register from "./pages/Masuk/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditProfil from "./pages/Utama/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";

import Awal from "./pages/Utama/Awal";
import Misi from "./pages/Utama/Misi/Misi";
import DetailMisi from "./pages/Utama/Misi/DetailMisi";
import Berita from "./pages/Utama/Konten/Berita";
import Pengetahuan from "./pages/Utama/Konten/Pengetahuan";
import Sejarah from "./pages/Utama/Konten/Sejarah";
import Setting from "./pages/Utama/Pengaturan/Setting";
import DetailBerita from "./pages/Utama/Konten/DetailKonten/DetailBerita";
import DetailPengetahuan from "./pages/Utama/Konten/DetailKonten/DetailPengetahuan";
import DetailSejarah from "./pages/Utama/Konten/DetailKonten/DetailSejarah";
import TukarPoin from "./pages/Utama/TukarPoin/TukarPoin";
import History from "./pages/Utama/Histori/History";

import { SettingsProvider, useSettings } from "./pages/Utama/Pengaturan/SettingsContext";

// === Admin Pages ===
import AdminLayout from "./pages/admin/AdminLayout";
import AdminBerita from "./pages/admin/AdminBerita";
import AdminPengetahuan from "./pages/admin/AdminPengetahuan";
import AdminSejarah from "./pages/admin/AdminSejarah";
import AdminMisi from "./pages/admin/AdminMisi";
import AdminUser from "./pages/admin/AdminUser";
import AdminRedeem from "./pages/admin/AdminRedeem";

// Map ukuran font ke class Tailwind
const fontSizeMap = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

// Map font family ke class Tailwind
const fontFamilyMap = {
  "sans-serif": "font-sans",
  serif: "font-serif",
  monospace: "font-mono",
};

const AppContent = () => {
  const { settings } = useSettings();

  const fontSizeClass = fontSizeMap[settings.fontSize] || "text-base";
  const fontFamilyClass = fontFamilyMap[settings.fontFamily] || "font-sans";

  return (
    <div
      className={`${fontSizeClass} ${fontFamilyClass} min-h-screen bg-gray-50 dark:bg-gray-900`}
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Protected routes */}
        <Route
          path="/awal"
          element={
            <ProtectedRoute>
              <Awal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/berita"
          element={
            <ProtectedRoute>
              <Berita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengetahuan"
          element={
            <ProtectedRoute>
              <Pengetahuan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sejarah"
          element={
            <ProtectedRoute>
              <Sejarah />
            </ProtectedRoute>
          }
        />
        <Route
          path="/misi"
          element={
            <ProtectedRoute>
              <Misi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/utama/detailmisi/:id"
          element={
            <ProtectedRoute>
              <DetailMisi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/utama/detailberita/:id"
          element={
            <ProtectedRoute>
              <DetailBerita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/utama/Detailpengetahuan/:id"
          element={
            <ProtectedRoute>
              <DetailPengetahuan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/utama/Detailsejarah/:id"
          element={
            <ProtectedRoute>
              <DetailSejarah />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengaturan"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profil"
          element={
            <ProtectedRoute>
              <EditProfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tukarpoin"
          element={
            <ProtectedRoute>
              <TukarPoin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/histori"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="berita" element={<AdminBerita />} />
          <Route path="pengetahuan" element={<AdminPengetahuan />} />
          <Route path="sejarah" element={<AdminSejarah />} />
          <Route path="misi" element={<AdminMisi />} />
          <Route path="user" element={<AdminUser />} />
          <Route path="Redeem" element={<AdminRedeem />} />
        </Route>
      </Routes>

      {/* ToastContainer sekali aja */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

const App = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;