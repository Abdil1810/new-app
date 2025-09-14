import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import HistoryCard from "./HistoryCard";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // ambil history berdasarkan userId
        const q = query(
          collection(db, "history"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            type: d.type || "unknown", // contoh: "misi", "tukar", "bonus"
            description: d.description || "Aktivitas tidak diketahui",
            poin: d.poin || 0,
            timestamp: d.timestamp?.toDate() || new Date(),
          };
        });

        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Riwayat Aktivitas</h1>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">Belum ada riwayat aktivitas.</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}