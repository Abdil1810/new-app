// src/pages/Admin/AdminUser.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "users"));
        const userData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);
      } catch (err) {
        console.error("Error fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus user ini?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Gagal hapus user:", err);
      alert("Gagal menghapus user. Cek console.");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
    } catch (err) {
      console.error("Gagal update role:", err);
      alert("Gagal mengubah role. Cek console.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manajemen User</h1>
        <div className="text-sm text-gray-600">
          {loading ? "Memuat..." : `Total user: ${users.length}`}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Nama</th>
              <th className="p-2 border text-left">Email</th>
              <th className="p-2 border text-left">Poin</th>
              <th className="p-2 border text-left">Role</th>
              <th className="p-2 border text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Memuat data user...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Belum ada user.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="p-2 border text-left">{user.displayName || "-"}</td>
                  <td className="p-2 border text-left">{user.email || "-"}</td>
                  <td className="p-2 border text-left">{user.poin ?? 0}</td>
                  <td className="p-2 border text-left">{user.role || "user"}</td>
                  <td className="p-2 border space-x-2 text-left">
                    <button
                      onClick={() =>
                        handleRoleChange(user.id, user.role === "admin" ? "user" : "admin")
                      }
                      className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                    >
                      {user.role === "admin" ? "Jadikan User" : "Jadikan Admin"}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={5} className="p-2 text-sm text-gray-600 text-right">
                {loading ? "" : `Total user: ${users.length}`}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
