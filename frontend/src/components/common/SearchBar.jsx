import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearchExecute, placeholder = "Search catalog parameters...", initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchExecute) onSearchExecute(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full h-10 bg-deep-black border border-border-dark rounded-lg flex items-center pr-2 focus-within:border-primary-gold transition-colors">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-full bg-transparent pl-4 pr-10 text-xs text-pure-white focus:outline-none font-heading tracking-wide"
      />
      
      {query && (
        <button 
          type="button" 
          onClick={() => setQuery("")} 
          className="absolute right-10 text-muted-gray hover:text-pure-white p-1"
        >
          <X size={14} />
        </button>
      )}

      <button type="submit" className="text-muted-gray hover:text-primary-gold p-1 transition-colors">
        <Search size={16} />
      </button>
    </form>
  );
};

export default SearchBar;