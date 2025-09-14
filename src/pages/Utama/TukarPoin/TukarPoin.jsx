import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import TukarPoinCard from "./TukarPoinCard";
import Sidebar from "../../../components/Awal/Sidebar";
import Topbar from "../../../components/Awal/Topbar";

export default function TukarPoin() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const q = query(collection(db, "rewards"), orderBy("poin", "asc"));
        const snapshot = await getDocs(q);
        const rewardsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRewards(rewardsData);
      } catch (err) {
        console.error("Gagal mengambil rewards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading rewards...</p>;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten utama */}
      <div className="flex flex-col flex-1">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="p-6 md:p-10 mt-14 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {rewards.map((reward) => (
              <TukarPoinCard key={reward.id} reward={reward} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}