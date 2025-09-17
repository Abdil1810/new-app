// src/pages/Admin/AdminRedeem.jsx
import { useState, useEffect } from "react";
import { 
  collection, doc, updateDoc, getDoc, increment, onSnapshot
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function AdminRedeem() {
  const [redeems, setRedeems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redeemCol = collection(db, "redeem");

    // Realtime listener
    const unsubscribe = onSnapshot(redeemCol, async (snapshot) => {
      const redeemData = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

        // Ambil displayName user
        let displayName = "Unknown";
        try {
          const userSnap = await getDoc(doc(db, "users", data.userId));
          if (userSnap.exists()) displayName = userSnap.data().displayName || "Unknown";
        } catch(e) {
          console.error("Gagal ambil displayName user:", e);
        }

        // Ambil tanggal redeem
        let tanggal = "Unknown";
        if (data.createdAt && data.createdAt.toDate) {
          tanggal = data.createdAt.toDate().toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        }

        return { id: docSnap.id, ...data, displayName, tanggal };
      }));

      setRedeems(redeemData);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener saat component unmount
  }, []);

  const updateRedeemStatus = (redeemId, status) => {
    setRedeems(prev => prev.map(r => r.id === redeemId ? { ...r, status } : r));
  };

  const handleApprove = async (redeem) => {
    try {
      const redeemRef = doc(db, "redeem", redeem.id);
      await updateDoc(redeemRef, { status: "approved" });

      const userRef = doc(db, "users", redeem.userId);
      await updateDoc(userRef, { poin: increment(-redeem.poinDipakai) });

      updateRedeemStatus(redeem.id, "approved");
      alert(`Redeem ${redeem.rewardName} berhasil diapprove!`);
    } catch (error) {
      console.error("Gagal approve redeem:", error);
      alert("Gagal approve redeem");
    }
  };

  const handleReject = async (redeem) => {
    try {
      const redeemRef = doc(db, "redeem", redeem.id);
      await updateDoc(redeemRef, { status: "rejected" });

      updateRedeemStatus(redeem.id, "rejected");
      alert(`Redeem ${redeem.rewardName} ditolak`);
    } catch (error) {
      console.error("Gagal reject redeem:", error);
      alert("Gagal reject redeem");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading redeem...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Redeem Poin</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Reward</th>
            <th className="border p-2">Poin Dipakai</th>
            <th className="border p-2">Tanggal Redeem</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {redeems.map((r) => (
            <tr key={r.id} className="text-center">
              <td className="border p-2">{r.displayName}</td>
              <td className="border p-2">{r.rewardName}</td>
              <td className="border p-2">{r.poinDipakai}</td>
              <td className="border p-2">{r.tanggal}</td>
              <td className="border p-2 font-semibold">{r.status}</td>
              <td className="border p-2 flex justify-center gap-2">
                {r.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(r)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(r)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
