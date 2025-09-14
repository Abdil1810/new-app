import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShield, FiUsers, FiBookOpen, FiTarget, FiFlag } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/landing/Header";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
	<>
      <Header />
	  
      {/* Hero Section */}
      <section className="flex flex-col justify-start pt-32 px-4 items-center bg-gradient-to-b from-yellow-100 to-white overflow-x-hidden">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 text-center mb-6">
          Selamat Datang di <span className="text-yellow-600">Dawnlessday</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 text-center max-w-xl mb-8">
          Portal informasi yang mengupas dunia dengan tajam, cerdas, dan berjiwa.
          Jelajahi berita, pengetahuan, dan sejarah dalam satu atap.
        </p>
        <Link
          to="/Awal"
          className="bg-yellow-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-md"
        >
          Login Untuk Memulai
        </Link>
      </section>

      {/* Section: Kenapa Memilih Dawnlessday */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white text-center overflow-x-hidden">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">Kenapa Memilih Dawnlessday?</h2>
        <p className="text-gray-500 mb-10 text-sm md:text-base max-w-xl mx-auto">
          Kami hadir bukan sekadar memberi informasi, tapi menyajikan makna.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div data-aos="fade-up" className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-yellow-700 text-3xl mb-3 mx-auto"><FiShield /></div>
            <h3 className="text-yellow-700 font-semibold text-lg mb-2">Tajam & Terpercaya</h3>
            <p className="text-gray-600 text-sm">Konten dikurasi dengan sudut pandang kritis dan berimbang.</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100" className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-yellow-700 text-3xl mb-3 mx-auto"><FiUsers /></div>
            <h3 className="text-yellow-700 font-semibold text-lg mb-2">Berbasis Komunitas</h3>
            <p className="text-gray-600 text-sm">Bangun platform bersama untuk menyuarakan kebenaran dan pengetahuan.</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="200" className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-yellow-700 text-3xl mb-3 mx-auto"><FiBookOpen /></div>
            <h3 className="text-yellow-700 font-semibold text-lg mb-2">Pengetahuan & Sejarah</h3>
            <p className="text-gray-600 text-sm">Tidak hanya berita — tapi juga wawasan mendalam dan reflektif.</p>
          </div>
        </div>
      </section>

      {/* Section: Visi & Misi */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-yellow-50 text-center overflow-x-hidden">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">Visi & Misi</h2>
        <p className="text-gray-600 mb-10 text-sm md:text-base max-w-xl mx-auto">
          Menjadi cahaya yang tak pernah padam dalam menyuarakan kebenaran dan menggali makna.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-start gap-12 max-w-6xl mx-auto text-left">
          {/* Visi */}
          <div data-aos="fade-right" className="flex-1 bg-white rounded-xl p-6 shadow">
            <div className="text-yellow-700 text-2xl mb-2"><FiTarget /></div>
            <h3 className="text-yellow-800 font-semibold text-xl mb-2">Visi</h3>
            <p className="text-gray-600 text-sm">
              Menjadi platform informasi dan refleksi yang membentuk masyarakat berpikir kritis, terbuka, dan berbudaya.
            </p>
          </div>

          {/* Misi */}
          <div data-aos="fade-left" className="flex-1 bg-white rounded-xl p-6 shadow">
            <div className="text-yellow-700 text-2xl mb-2"><FiFlag /></div>
            <h3 className="text-yellow-800 font-semibold text-xl mb-2">Misi</h3>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li>Menghadirkan berita yang jujur, tajam, dan mencerahkan.</li>
              <li>Menggali sejarah sebagai cermin kehidupan masa kini dan mendatang.</li>
              <li>Membangun komunitas pembelajar yang saling berbagi pengetahuan.</li>
              <li>Mendorong partisipasi publik dalam membentuk dunia yang lebih sadar dan adil.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;