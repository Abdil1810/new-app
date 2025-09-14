import React from "react";
import { useSettings } from "./SettingsContext";

const fonts = [
  { label: "Sans Serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
];

const fontSizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

const Setting = () => {
  const { settings, updateSetting } = useSettings();

  const handleNotificationToggle = async (isChecked) => {
    if (isChecked && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Izin notifikasi ditolak");
        return;
      }
    }
    updateSetting("notifications", isChecked);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        ⚙️ Pengaturan Tampilan
      </h1>

      {/* Font Family */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Jenis Font
        </label>
        <select
          value={settings.fontFamily}
          onChange={(e) => updateSetting("fontFamily", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500"
        >
          {fonts.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Ukuran Font
        </label>
        <select
          value={settings.fontSize}
          onChange={(e) => updateSetting("fontSize", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500"
        >
          {fontSizes.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          Mode Gelap
        </span>
        <button
          onClick={() => updateSetting("darkMode", !settings.darkMode)}
          className={`w-14 h-8 flex items-center rounded-full transition-colors duration-300 ${
            settings.darkMode ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              settings.darkMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          Notifikasi
        </span>
        <button
          onClick={() => handleNotificationToggle(!settings.notifications)}
          className={`w-14 h-8 flex items-center rounded-full transition-colors duration-300 ${
            settings.notifications ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              settings.notifications ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Setting;