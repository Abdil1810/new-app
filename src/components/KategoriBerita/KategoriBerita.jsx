const KategoriBerita = ({ selectedKategori, setSelectedKategori }) => {
  const kategoriOptions = ["Semua", "Politik", "Teknologi", "Olahraga", "Ekonomi"]; // contoh kategori

  return (
    <select
      value={selectedKategori}
      onChange={(e) => setSelectedKategori(e.target.value)}
      className="border border-gray-300 rounded px-4 py-2"
    >
      {kategoriOptions.map((kategori) => (
        <option key={kategori} value={kategori}>
          {kategori}
        </option>
      ))}
    </select>
  );
};

export default KategoriBerita;