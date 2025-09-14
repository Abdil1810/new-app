import { useNavigate } from "react-router-dom";

const CardBerita = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/utama/Detailberita/${data.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden 
                 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Gambar */}
      <div className="relative">
        <img
          src={data.gambar}
          alt={data.judul}
          className="w-full h-48 object-cover"
        />
        {data.kategori && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
            {data.kategori}
          </span>
        )}
      </div>

      {/* Konten */}
      <div className="p-4 flex flex-col justify-between h-32">
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
          {data.judul}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {data.createdAt
            ? new Date(data.createdAt.seconds * 1000).toLocaleDateString(
                "id-ID",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )
            : ""}
        </p>
      </div>
    </div>
  );
};

export default CardBerita;