// src/components/KategoriSejarah/CardSejarah.jsx
import { format } from "date-fns";

const CardSejarah = ({ sejarah }) => {
  const { judul, isi, tanggal, kategori, gambar } = sejarah;

  const formatTanggal = (tanggal) => {
    if (!tanggal?.seconds) return "";
    return format(new Date(tanggal.seconds * 1000), "dd MMM yyyy");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      {gambar && (
        <img
          src={gambar}
          alt="gambar sejarah"
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">
          {formatTanggal(tanggal)} • {kategori}
        </p>
        <h2 className="text-lg font-semibold text-black mb-2">{judul}</h2>
        <p className="text-gray-700 text-sm line-clamp-3">{isi}</p>
      </div>
    </div>
  );
};

export default CardSejarah;