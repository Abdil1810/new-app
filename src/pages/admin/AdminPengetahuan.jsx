import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Trash2, PlusCircle, ChevronDown, ChevronUp, Pencil } from "lucide-react";

export default function AdminPengetahuan() {
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [kontenPengetahuan, setKontenPengetahuan] = useState("");
  const [gambar, setGambar] = useState("");
  const [gambarMisi, setGambarMisi] = useState("");
  const [durasi, setDurasi] = useState("");
  const [poinMisi, setPoinMisi] = useState("");
  const [namaMisi, setNamaMisi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [pengetahuan, setPengetahuan] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const colRef = collection(db, "pengetahuan");

  // load data
  const loadPengetahuan = async () => {
    const snapshot = await getDocs(colRef);
    setPengetahuan(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

useEffect(() => {
  const loadPengetahuan = async () => {
    const snapshot = await getDocs(colRef);
    setPengetahuan(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };
  loadPengetahuan();
}, [colRef]);

  // submit tambah atau edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      // mode update
      const docRef = doc(db, "pengetahuan", editId);
      await updateDoc(docRef, {
        judul,
        kategori,
        kontenPengetahuan,
        gambar,
        gambarMisi,
        durasi: Number(durasi),
        poinMisi: Number(poinMisi),
        namaMisi,
        tanggal: new Date(tanggal),
      });
      alert("✅ Pengetahuan berhasil diupdate!");
    } else {
      // mode tambah
      await addDoc(colRef, {
        judul,
        kategori,
        kontenPengetahuan,
        gambar,
        gambarMisi,
        durasi: Number(durasi),
        poinMisi: Number(poinMisi),
        namaMisi,
        tanggal: new Date(tanggal),
        createdAt: serverTimestamp(),
      });
      alert("✅ Pengetahuan baru berhasil ditambahkan!");
    }

    // reset
    resetForm();
    loadPengetahuan();
    setOpenForm(false);
  };

  // hapus data
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "pengetahuan", id));
    alert("🗑️ Data pengetahuan berhasil dihapus!");
    loadPengetahuan();
  };

  // masuk ke mode edit
  const handleEdit = (item) => {
    setEditId(item.id);
    setJudul(item.judul);
    setKategori(item.kategori);
    setKontenPengetahuan(item.kontenPengetahuan);
    setGambar(item.gambar || "");
    setGambarMisi(item.gambarMisi || "");
    setDurasi(item.durasi || "");
    setPoinMisi(item.poinMisi || "");
    setNamaMisi(item.namaMisi || "");
    setTanggal(
      item.tanggal
        ? new Date(item.tanggal.seconds * 1000).toISOString().split("T")[0]
        : ""
    );
    setOpenForm(true);
  };

  // reset form
  const resetForm = () => {
    setJudul("");
    setKategori("");
    setKontenPengetahuan("");
    setGambar("");
    setGambarMisi("");
    setDurasi("");
    setPoinMisi("");
    setNamaMisi("");
    setTanggal("");
    setEditId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-600">
        Kelola Pengetahuan
      </h2>

      {/* Tombol toggle form */}
      <button
        onClick={() => {
          if (openForm) {
            resetForm();
          }
          setOpenForm(!openForm);
        }}
        className="flex items-center gap-2 mb-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        {openForm ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        {openForm
          ? editId
            ? "Tutup Form Edit"
            : "Tutup Form"
          : "Tambah Pengetahuan"}
      </button>

      {/* Form tambah / edit pengetahuan */}
      {openForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Judul"
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              placeholder="Kategori"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <textarea
            value={kontenPengetahuan}
            onChange={(e) => setKontenPengetahuan(e.target.value)}
            placeholder="Isi pengetahuan"
            className="w-full border p-2 rounded"
            rows={4}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              value={gambar}
              onChange={(e) => setGambar(e.target.value)}
              placeholder="URL Gambar"
              className="border p-2 rounded w-full"
            />
            <input
              type="url"
              value={gambarMisi}
              onChange={(e) => setGambarMisi(e.target.value)}
              placeholder="URL Gambar Misi"
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              value={durasi}
              onChange={(e) => setDurasi(e.target.value)}
              placeholder="Durasi Detik Baca"
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              value={poinMisi}
              onChange={(e) => setPoinMisi(e.target.value)}
              placeholder="Poin Misi"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              value={namaMisi}
              onChange={(e) => setNamaMisi(e.target.value)}
              placeholder="Nama Misi"
              className="border p-2 rounded w-full"
            />
          </div>

          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2 text-white rounded transition ${
              editId
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <PlusCircle size={18} />
            {editId ? "Update Pengetahuan" : "Simpan Pengetahuan"}
          </button>
        </form>
      )}

      {/* List pengetahuan */}
      <div className="space-y-4">
        {pengetahuan.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white shadow rounded-lg flex gap-4 items-start"
          >
            {item.gambar && (
              <img
                src={item.gambar}
                alt={item.judul}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{item.judul}</h3>
              <p className="text-sm text-gray-500">{item.kategori}</p>
              <p className="mt-1 text-gray-700 text-sm">{item.konten}</p>

              {item.namaMisi && (
                <p className="mt-1 text-xs text-green-600 font-medium">
                  🎯 Misi: {item.namaMisi} ({item.poinMisi} poin, {item.durasi}{" "}
                  Detik Baca)
                </p>
              )}

              {/* Tampilkan ID */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-400 break-all">
                  ID: {item.id}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.id);
                    alert("📋 ID berhasil dicopy!");
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Copy ID
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}