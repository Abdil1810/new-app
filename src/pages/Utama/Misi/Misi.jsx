import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  runTransaction,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import MisiCard from "../../../components/AwalSide/MisiCard";
import Sidebar from "../../../components/Awal/Sidebar";
import Topbar from "../../../components/Awal/Topbar";
import { motion, AnimatePresence } from "framer-motion";

const Misi = () => {
  const [misiList, setMisiList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const fetchMisi = async () => {
      const misiSnapshot = await getDocs(collection(db, "missions"));
      const misiData = misiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMisiList(misiData);
    };

    const fetchUser = async () => {
      const userSnap = await getDocs(collection(db, "users"));
      const user = userSnap.docs.find((d) => d.id === auth.currentUser.uid);
      if (user) setUserData(user.data());
    };

    fetchMisi();
    fetchUser();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "pointsHistory"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const histories = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHistoryList(histories);
    });

    return () => unsubscribe();
  }, []);

  const handleComplete = async (misiId, poin) => {
    if (userData?.completedMissions?.includes(misiId)) {
      alert("Misi sudah pernah diselesaikan.");
      return;
    }

    const userRef = doc(db, "users", auth.currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) throw new Error("User tidak ditemukan.");

        const currentData = userDoc.data();
        if ((currentData.completedMissions || []).includes(misiId)) {
          throw new Error("Misi sudah pernah diselesaikan.");
        }

        const updatedPoints = (currentData.points || 0) + poin;
        const updatedCompleted = [...(currentData.completedMissions || []), misiId];

        // Update user
        transaction.update(userRef, {
          points: updatedPoints,
          completedMissions: updatedCompleted,
        });

        // Buat history baru
        const historyRef = doc(collection(db, "pointsHistory"));
        transaction.set(historyRef, {
          userId: auth.currentUser.uid,
          misiId,
          poin,
          timestamp: serverTimestamp(),
          type: "mission_complete",
        });

        setUserData({
          ...currentData,
          points: updatedPoints,
          completedMissions: updatedCompleted,
        });
      });
      alert("Misi berhasil diselesaikan dan poin bertambah!");
    } catch (error) {
      alert("Gagal menyelesaikan misi: " + error.message);
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
        <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1">
        <Topbar toggleSidebar={toggleSidebar} />
      <main className="p-6 md:p-10 mt-14 flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {misiList.map((misi) => (
            <MisiCard
              key={misi.id}
              misi={misi}
              isCompleted={userData?.completedMissions?.includes(misi.id)}
              onComplete={() => handleComplete(misi.id, misi.poin)}
            />
          ))}
        </div>

  {/* Tombol Floating History */}
  <button onClick={() => setHistoryOpen(true)}
    className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-yellow-500 
               text-white font-semibold px-5 py-3 rounded-full shadow-lg 
               hover:from-yellow-500 hover:to-yellow-600 transition"
    title="Cek History Poin & Misi">
    Cek History
  </button>
          {/* Modal History */}
          <AnimatePresence>
            {historyOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-auto p-6 relative shadow-lg"
                >
                  <h2 className="text-xl font-bold mb-4">History Poin & Misi</h2>
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
                  >
                    ×
                  </button>

                  {historyList.length === 0 ? (
                    <p className="text-gray-500">Belum ada history poin.</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {historyList.map((history) => {
                        const misiName =
                          misiList.find((m) => m.id === history.misiId)?.title ||
                          "Misi tidak ditemukan";

                        const dateStr = history.timestamp?.toDate
                          ? history.timestamp.toDate().toLocaleString()
                          : "-";

                        return (
                          <li key={history.id} className="py-2 flex justify-between items-center">
                            <span className="text-sm">{misiName}</span>
                            <span className="font-semibold text-yellow-600">
                              +{history.poin}
                            </span>
                            <span className="text-gray-400 text-xs ml-4">{dateStr}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Misi;