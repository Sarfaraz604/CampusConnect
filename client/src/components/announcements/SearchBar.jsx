const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search announcements..."
      className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBar;
