import { motion } from "framer-motion";

export default function HistoryCard({ item }) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="shadow-md rounded-2xl bg-white">
        <div className="p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{item.type}</p>
            <p className="text-sm text-gray-500">
              {item.timestamp
                ? new Date(item.timestamp.toDate()).toLocaleString()
                : "Tanggal tidak tersedia"}
            </p>
          </div>
          <p
            className={`font-bold ${
              item.amount > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {`item.amount > 0 ? +${item.amount} : item.amount`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}