import { Search } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    <div className="flex-1 relative">
      <Search
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by doctor, specialty..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);

export default SearchBar;
