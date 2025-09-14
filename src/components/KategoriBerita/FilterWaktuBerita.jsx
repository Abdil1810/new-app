
const FilterWaktuBerita = ({ selectedWaktu, setSelectedWaktu }) => {
  const waktuOptions = [
    "Semua",
    "24 Jam Terakhir",
    "7 Hari Terakhir",
    "30 Hari Terakhir",
  ];

  return (
    <select
      value={selectedWaktu}
      onChange={(e) => setSelectedWaktu(e.target.value)}
      className="border border-gray-300 rounded px-4 py-2"
    >
      {waktuOptions.map((waktu) => (
        <option key={waktu} value={waktu}>
          {waktu}
        </option>
      ))}
    </select>
  );
};

export default FilterWaktuBerita;
