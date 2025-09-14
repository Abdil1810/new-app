import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const MisiCard = ({ misi, isCompleted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[320px]"
    >
      <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 
                      rounded-2xl shadow-lg p-6 w-full h-44 
                      flex flex-col justify-between text-white relative overflow-hidden
                      flex flex-col justify-between 
                      p-4 sm:p-5 text-white
                      transition-transform duration-300 
                      hover:scale-[1.05] hover:shadow-2xl">
        
        {/* Judul dan poin */}
        <div>
          <h3 className="text-lg font-semibold truncate">{misi.judul}</h3>
          <p className="text-sm font-bold mt-1">+{misi.poin} Poin</p>
          <p className="text-xs text-white/80 mt-1">
            {misi.createdAt}
          </p>
        </div>

        {/* Status / tombol */}
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
    </motion.div>
  );
};

export default MisiCard;