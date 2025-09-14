import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Newspaper, BookOpen, History, Target, Menu, Users } from "lucide-react";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-white shadow-lg flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isOpen && (
            <span className="text-2xl font-bold text-blue-600">
              Dawnlessday
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin/berita"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Newspaper size={20} />
            {isOpen && <span>Berita</span>}
          </NavLink>

          <NavLink
            to="/admin/pengetahuan"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <BookOpen size={20} />
            {isOpen && <span>Pengetahuan</span>}
          </NavLink>

          <NavLink
            to="/admin/sejarah"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <History size={20} />
            {isOpen && <span>Sejarah</span>}
          </NavLink>

          <NavLink
            to="/admin/misi"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Target size={20} />
            {isOpen && <span>Misi</span>}
          </NavLink>

          {/* Admin User */}
          <NavLink
            to="/admin/user"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Users size={20} />
            {isOpen && <span>User</span>}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-sm text-gray-500 text-center">
          {isOpen ? "© 2025 Dawnlessday" : "©"}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
