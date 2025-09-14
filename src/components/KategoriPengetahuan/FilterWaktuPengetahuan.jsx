const KategoriWaktu = ({ onChange }) => {
  return (
    <select onChange={(e) => onChange(e.target.value)} className="p-2 rounded border">
      <option value="">Semua Waktu</option>
      <option value="24jam">24 Jam Terakhir</option>
      <option value="7hari">7 Hari Terakhir</option>
      <option value="30hari">30 Hari Terakhir</option>
    </select>
  );
};

export default KategoriWaktu;