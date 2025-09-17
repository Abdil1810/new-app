import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Newspaper, BookOpen, History, Target, Menu, Users, Gift } from "lucide-react";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false); // default tertutup

  const navItems = [
    { to: "/admin/berita", label: "Berita", icon: Newspaper },
    { to: "/admin/pengetahuan", label: "Pengetahuan", icon: BookOpen },
    { to: "/admin/sejarah", label: "Sejarah", icon: History },
    { to: "/admin/misi", label: "Misi", icon: Target },
    { to: "/admin/user", label: "User", icon: Users },
    { to: "/admin/redeem", label: "Redeem", icon: Gift },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white/90 backdrop-blur-lg border-r border-gray-200 shadow-xl transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span
            className={`text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text transition-all duration-300
              ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          >
            Dawnlessday
          </span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-xl transition-all duration-300
                ${isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"}`
              }
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                <item.icon size={20} />
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-300
                  ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 w-0 overflow-hidden"}`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          {isOpen ? "© 2025 Dawnlessday" : "©"}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
