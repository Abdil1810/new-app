import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dropdown() {
const [open, setOpen] = useState(false);

return (
<div className="relative">
{/* Tombol Toggle */}
<button
onClick={() => setOpen(!open)}
className="text-yellow-700 z-50 relative"
>
{open ? <X size={24} /> : <Menu size={24} />}
</button>

{/* Menu Dropdown */}  
  <AnimatePresence>  
    {open && (  
      <motion.ul  
        key="dropdown"  
        initial={{ opacity: 0, y: -10 }}  
        animate={{ opacity: 1, y: 0 }}  
        exit={{ opacity: 0, y: -10 }}  
        transition={{ duration: 0.3, ease: "easeInOut" }}  
        className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-xl p-4 z-40 space-y-3"  
      >  
        <li>  
          <Link to="/" onClick={() => setOpen(false)} className="block text-yellow-700 hover:text-blue-700 transition">  
            Home  
          </Link>  
        </li>  
        <li>  
          <Link to="/about" onClick={() => setOpen(false)} className="block text-yellow-700 hover:text-blue-700 transition">  
            About  
          </Link>  
        </li>  
        <li>  
          <Link to="/privacy" onClick={() => setOpen(false)} className="block text-yellow-700 hover:text-blue-700 transition">  
            Privacy & Policy  
          </Link>  
        </li>  
        <li>  
          <Link to="/insentif" onClick={() => setOpen(false)} className="block text-yellow-700 hover:text-blue-700 transition">  
            Insentif  
          </Link>  
        </li>  

        {/* Tombol Masuk & Daftar */}  
        <li className="pt-2">  
          <div className="flex justify-between gap-2">  
            <Link  
              to="/Login"  
              onClick={() => setOpen(false)}  
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium text-center py-2 rounded-lg transition"  
            >  
              Masuk  
            </Link>  
            <Link  
              to="/Register"  
              onClick={() => setOpen(false)}  
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium text-center py-2 rounded-lg transition"  
            >  
              Daftar  
            </Link>  
          </div>  
        </li>  
      </motion.ul>  
    )}  
  </AnimatePresence>  
</div>

);
}

