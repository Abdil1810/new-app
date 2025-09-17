import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const MisiCard = ({ misi, isCompleted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[300px] sm:max-w-[320px] md:max-w-[350px]"
    >
      <div
        className="h-44 sm:h-48 md:h-52 rounded-2xl shadow-lg overflow-hidden relative
                   flex flex-col justify-between p-4 text-white
                   transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${misi.imageUrl})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl"></div>

        {/* Konten */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold truncate">{misi.judul}</h3>
            <p className="text-sm sm:text-base font-bold mt-1">+{misi.poin} Poin</p>
            <p className="text-xs sm:text-sm text-white/80 mt-1">{misi.createdAt}</p>
          </div>

          <div className="flex justify-end">
            {isCompleted ? (
              <FiCheckCircle className="text-green-200 text-3xl drop-shadow" />
            ) : (
              <Link
                to={`/utama/detailmisi/${misi.id}`}
                className="bg-white text-yellow-600 font-semibold px-4 py-1 rounded-lg text-sm shadow hover:bg-gray-100 transition"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MisiCard;
