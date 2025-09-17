import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Trash2, PlusCircle, Pencil } from "lucide-react";

const AdminMisi = () => {
  const [misiList, setMisiList] = useState([]);
  const [newMisi, setNewMisi] = useState({
    title: "",
    judul: "",
    deskripsi: "",
    poin: "",
    gambarMisi: "",
    imageUrl: "",
    poinMisi: "",
    durasi: "",
    targetType: "",
    idBerita: "",
    idPengetahuan: "",
    idSejarah: "",
    tanggalMulai: "",
    tanggalSelesai: "",
  });
  const [editMisi, setEditMisi] = useState(null);

  // Ambil data misi dari Firestore
  const fetchMisi = async () => {
    const misiSnapshot = await getDocs(collection(db, "missions"));
    const misiData = misiSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMisiList(misiData);
  };

  useEffect(() => {
    fetchMisi();
  }, []);

  // Tambah misi baru
  const handleAddMisi = async () => {
    if (!newMisi.title || !newMisi.judul || !newMisi.deskripsi || !newMisi.targetType) {
      alert("Lengkapi semua field wajib");
      return;
    }

    await addDoc(collection(db, "missions"), {
      title: newMisi.title,
      judul: newMisi.judul,
      deskripsi: newMisi.deskripsi,
      poin: Number(newMisi.poin),
      gambarMisi: (newMisi.gambarMisi),
      imageUrl: (newMisi.imageUrl),
      poinMisi: Number(newMisi.poinMisi),
      durasi: Number(newMisi.durasi),
      targetType: newMisi.targetType,
      idBerita: newMisi.idBerita,
      idPengetahuan: newMisi.idPengetahuan,
      idSejarah: newMisi.idSejarah,
      tanggalMulai: newMisi.tanggalMulai
        ? Timestamp.fromDate(new Date(newMisi.tanggalMulai))
        : serverTimestamp(),
      tanggalSelesai: newMisi.tanggalSelesai
        ? Timestamp.fromDate(new Date(newMisi.tanggalSelesai))
        : serverTimestamp(),
    });

    setNewMisi({
      title: "",
      judul: "",
      deskripsi: "",
      poin: 0,
      gambarMisi: "",
      imageUrl: "",
      poinMisi: 0,
      durasi: 0,
      targetType: "",
      idBerita: "",
      idPengetahuan: "",
      idSejarah: "",
      tanggalMulai: "",
      tanggalSelesai: "",
    });
    fetchMisi();
  };

  // Hapus misi
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "missions", id));
    fetchMisi();
  };

// Update misi
const handleUpdate = async () => {
  if (!editMisi) return;

  const ref = doc(db, "missions", editMisi.id);

  // Konversi tanggal
  const tanggalMulai = editMisi.tanggalMulai && !isNaN(new Date(editMisi.tanggalMulai))
    ? Timestamp.fromDate(new Date(editMisi.tanggalMulai))
    : serverTimestamp();

  const tanggalSelesai = editMisi.tanggalSelesai && !isNaN(new Date(editMisi.tanggalSelesai))
    ? Timestamp.fromDate(new Date(editMisi.tanggalSelesai))
    : serverTimestamp();

  await updateDoc(ref, {
    title: editMisi.title,
    judul: editMisi.judul,
    deskripsi: editMisi.deskripsi,
    poin: Number(editMisi.poin),
    gambarMisi: editMisi.gambarMisi,
    imageUrl: editMisi.imageUrl,
    poinMisi: Number(editMisi.poinMisi),
    durasi: Number(editMisi.durasi),
    targetType: editMisi.targetType,
    idBerita: editMisi.idBerita,
    idPengetahuan: editMisi.idPengetahuan,
    idSejarah: editMisi.idSejarah,
    tanggalMulai,
    tanggalSelesai,
  });

  setEditMisi(null);
  fetchMisi();
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin - Kelola Misi</h1>

      {/* Form Tambah Misi */}
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Tambah Misi Baru</h2>

        <input
          type="text"
          placeholder="Nama Misi"
          value={newMisi.title}
          onChange={(e) => setNewMisi({ ...newMisi, title: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Judul"
          value={newMisi.judul}
          onChange={(e) => setNewMisi({ ...newMisi, judul: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <textarea
          placeholder="Deskripsi"
          value={newMisi.deskripsi}
          onChange={(e) => setNewMisi({ ...newMisi, deskripsi: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          placeholder="Poin"
          value={newMisi.poin}
          onChange={(e) => setNewMisi({ ...newMisi, poin: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          placeholder="Poin Misi"
          value={newMisi.poinMisi}
          onChange={(e) => setNewMisi({ ...newMisi, poinMisi: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="url gambar"
          value={newMisi.gambarMisi}
          onChange={(e) => setNewMisi({ ...newMisi, gambarMisi: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Card Misi url"
          value={newMisi.imageUrl}
          onChange={(e) => setNewMisi({ ...newMisi, imageUrl: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          placeholder="Durasi (detik)"
          value={newMisi.durasi}
          onChange={(e) => setNewMisi({ ...newMisi, durasi: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />

        {/* Pilihan Target Type */}
        <select
          value={newMisi.targetType}
          onChange={(e) => setNewMisi({ ...newMisi, targetType: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        >
          <option value="">Pilih Target Type</option>
          <option value="berita">Berita</option>
          <option value="pengetahuan">Pengetahuan</option>
          <option value="sejarah">Sejarah</option>
        </select>

        {/* Kondisi input sesuai targetType */}
        {newMisi.targetType === "berita" && (
          <input
            type="text"
            placeholder="Masukkan ID Berita"
            value={newMisi.idBerita}
            onChange={(e) => setNewMisi({ ...newMisi, idBerita: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
        )}
        {newMisi.targetType === "pengetahuan" && (
          <input
            type="text"
            placeholder="Masukkan ID Pengetahuan"
            value={newMisi.idPengetahuan}
            onChange={(e) => setNewMisi({ ...newMisi, idPengetahuan: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
        )}
        {newMisi.targetType === "sejarah" && (
          <input
            type="text"
            placeholder="Masukkan ID Sejarah"
            value={newMisi.idSejarah}
            onChange={(e) => setNewMisi({ ...newMisi, idSejarah: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
        )}

        {/* Tanggal */}
        <input
          type="datetime-local"
          value={newMisi.tanggalMulai}
          onChange={(e) => setNewMisi({ ...newMisi, tanggalMulai: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="datetime-local"
          value={newMisi.tanggalSelesai}
          onChange={(e) => setNewMisi({ ...newMisi, tanggalSelesai: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />

        <button
          onClick={handleAddMisi}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <PlusCircle size={18} /> Tambah Misi
        </button>
      </div>

      {/* List Misi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {misiList.map((misi) => (
          <div key={misi.id} className="bg-white shadow rounded p-4 relative">
            {editMisi?.id === misi.id ? (
              <>
                {/* Form Edit */}
                <input
                  type="text"
                  value={editMisi.title}
                  onChange={(e) => setEditMisi({ ...editMisi, title: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                />
                <input
                  type="text"
                  value={editMisi.judul}
                  onChange={(e) => setEditMisi({ ...editMisi, judul: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                />
                <textarea
                  value={editMisi.deskripsi}
                  onChange={(e) => setEditMisi({ ...editMisi, deskripsi: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                />
                <input
                  type="number"
                  value={editMisi.poin}
                  onChange={(e) => setEditMisi({ ...editMisi, poin: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                />
                <input
                  type="number"
                  value={editMisi.poinMisi}
                  onChange={(e) => setEditMisi({ ...editMisi, poinMisi: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                />
                <input
                 type="text"
                 placeholder="url"
                 value={newMisi.gambarMisi}
                 onChange={(e) => setNewMisi({ ...newMisi, gambarMisi: e.target.value })}
                 className="border p-2 w-full mb-2 rounded"
                 />
                <input
                  type="number"
                  value={editMisi.durasi}
                  onChange={(e) => setEditMisi({ ...editMisi, durasi: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                />

                <select
                  value={editMisi.targetType}
                  onChange={(e) => setEditMisi({ ...editMisi, targetType: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                >
                  <option value="">Pilih Target Type</option>
                  <option value="berita">Berita</option>
                  <option value="pengetahuan">Pengetahuan</option>
                  <option value="sejarah">Sejarah</option>
                </select>

                {editMisi.targetType === "berita" && (
                  <input
                    type="text"
                    placeholder="Masukkan ID Berita"
                    value={editMisi.idBerita}
                    onChange={(e) => setEditMisi({ ...editMisi, idBerita: e.target.value })}
                    className="border p-2 w-full mb-2 rounded"
                  />
                )}
                {editMisi.targetType === "pengetahuan" && (
                  <input
                    type="text"
                    placeholder="Masukkan ID Pengetahuan"
                    value={editMisi.idPengetahuan}
                    onChange={(e) => setEditMisi({ ...editMisi, idPengetahuan: e.target.value })}
                    className="border p-2 w-full mb-2 rounded"
                  />
                )}
                {editMisi.targetType === "sejarah" && (
                  <input
                    type="text"
                    placeholder="Masukkan ID Sejarah"
                    value={editMisi.idSejarah}
                    onChange={(e) => setEditMisi({ ...editMisi, idSejarah: e.target.value })}
                    className="border p-2 w-full mb-2 rounded"
                  />
                )}

                <input
                  type="datetime-local"
                  value={
                    editMisi.tanggalMulai?.seconds
                      ? new Date(editMisi.tanggalMulai.seconds * 1000)
                          .toISOString()
                          .slice(0, 16)
                      : editMisi.tanggalMulai || ""
                  }
                  onChange={(e) => setEditMisi({ ...editMisi, tanggalMulai: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                />
                <input
                  type="datetime-local"
                  value={
                    editMisi.tanggalSelesai?.seconds
                      ? new Date(editMisi.tanggalSelesai.seconds * 1000)
                          .toISOString()
                          .slice(0, 16)
                      : editMisi.tanggalSelesai || ""
                  }
                  onChange={(e) => setEditMisi({ ...editMisi, tanggalSelesai: e.target.value })}
                  className="border p-2 w-full mb-2 rounded"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditMisi(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg">{misi.title}</h3>
                <p className="text-sm text-gray-600">{misi.deskripsi}</p>
                <p className="font-semibold text-yellow-600">+{misi.poin} poin</p>
                <p className="text-xs text-gray-500">Durasi: {misi.durasi} detik</p>
                <p className="text-xs">Target: {misi.targetType}</p>
                {misi.idBerita && <p className="text-xs">ID Berita: {misi.idBerita}</p>}
                {misi.idPengetahuan && <p className="text-xs">ID Pengetahuan: {misi.idPengetahuan}</p>}
                {misi.idSejarah && <p className="text-xs">ID Sejarah: {misi.idSejarah}</p>}
                <p className="text-xs">
                  Mulai:{" "}
                  {misi.tanggalMulai?.seconds
                    ? new Date(misi.tanggalMulai.seconds * 1000).toLocaleString()
                    : "-"}
                </p>
                <p className="text-xs">
                  Selesai:{" "}
                  {misi.tanggalSelesai?.seconds
                    ? new Date(misi.tanggalSelesai.seconds * 1000).toLocaleString()
                    : "-"}
                </p>

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => setEditMisi(misi)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(misi.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMisi;