const SearchbarPengetahuan = ({ searchQuery, setSearchQuery }) => (
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Cari berita..."
    className="relative z-10 bg-transparent text-black placeholder-white outline-none px-4 py-2 w-full sm:w-64 border-b border-white"
  />
);

export default SearchbarPengetahuan;