import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Realtime listener users
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetch users:", err);
        setLoading(false);
      }
    );

    // cleanup listener saat komponen unmount
    return () => unsub();
  }, []);

  // 🔹 Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus user ini?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (err) {
      console.error("Gagal hapus user:", err);
      alert("Gagal menghapus user. Cek console.");
    }
  };

  // 🔹 Update role
  const handleRoleChange = async (id, newRole) => {
    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
    } catch (err) {
      console.error("Gagal update role:", err);
      alert("Gagal mengubah role. Cek console.");
    }
  };

  // 🔹 Approve misi user
  const handleApproveMission = async (userId, missionIndex) => {
    try {
      const userRef = doc(db, "users", userId);
      const user = users.find((u) => u.id === userId);
      if (!user || !user.misiSelesai) return;

      const updatedMisi = [...user.misiSelesai];
      const mission = updatedMisi[missionIndex];
      if (!mission) return;

      updatedMisi[missionIndex] = { ...mission, approved: true };

      let tambahPoin = 0;
      try {
        const missionRef = doc(db, "missions", mission.missionId);
        const missionSnap = await getDoc(missionRef);
        if (missionSnap.exists()) {
          tambahPoin = missionSnap.data().poinMisi || 0;
        }
      } catch (err) {
        console.warn("Gagal ambil poin misi:", err);
      }

      await updateDoc(userRef, {
        misiSelesai: updatedMisi,
        poin: increment(tambahPoin), // ✅ lebih aman untuk race condition
      });
    } catch (err) {
      console.error("Gagal approve misi:", err);
      alert("Gagal approve misi. Cek console.");
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
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Nama</th>
              <th className="p-2 border text-left">Email</th>
              <th className="p-2 border text-left">Poin</th>
              <th className="p-2 border text-left">Role</th>
              <th className="p-2 border text-left">Misi</th>
              <th className="p-2 border text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Memuat data user...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Belum ada user.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="p-2 border text-left">
                    {user.displayName || "-"}
                  </td>
                  <td className="p-2 border text-left">{user.email || "-"}</td>
                  <td className="p-2 border text-left">{user.poin ?? 0}</td>
                  <td className="p-2 border text-left">{user.role || "user"}</td>
                  <td className="p-2 border text-left">
                    {user.misiSelesai && user.misiSelesai.length > 0 ? (
                      <ul className="space-y-1">
                        {user.misiSelesai.map((misi, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span>
                              {misi.missionId} -{" "}
                              {misi.approved ? (
                                <span className="text-green-600">Approved</span>
                              ) : (
                                <span className="text-red-600">Pending</span>
                              )}
                            </span>
                            {!misi.approved && (
                              <button
                                onClick={() =>
                                  handleApproveMission(user.id, idx)
                                }
                                className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
                              >
                                Approve
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">Belum ada misi</span>
                    )}
                  </td>
                  <td className="p-2 border space-x-2 text-left">
                    <button
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.role === "admin" ? "user" : "admin"
                        )
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
        </table>
      </div>
    </div>
  );
}
