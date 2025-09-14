import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const KategoriBerita = ({ onChange }) => {
  const [kategori, setKategori] = useState([]);

  useEffect(() => {
    const fetchKategori = async () => {
      const snapshot = await getDocs(collection(db, "kategori_sejarah"));
      const list = snapshot.docs.map(doc => doc.data().nama);
      setKategori(list);
    };
    fetchKategori();
  }, []);

  return (
    <select onChange={(e) => onChange(e.target.value)} className="p-2 rounded border">
      <option value="">Semua Kategori</option>
      {kategori.map((item, idx) => (
        <option key={idx} value={item}>{item}</option>
      ))}
    </select>
  );
};

export default KategoriBerita;


