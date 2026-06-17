import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, HelpCircle, Loader2 } from "lucide-react";
// FIXED (Issue 2): Sourced the standardized, global product card card layout component
import ProductCard from "../components/product/ProductCard";
// FIXED (Issue 4): Imported central API instance utility framework to trigger actual network searches
import api from "../utils/api";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // FIXED (Issue 1): Replaced static in-memory inventory datasets with dynamic network state handlers
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Synchronize local search input values with parent history navigation hooks
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // FIXED (Issue 4): Real-time network effect dispatch loop fires whenever query tracking tokens shift
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        // Dispatches structural query parameter directly down to productController.getProducts
        const res = await api.get("/products", {
          params: { search: searchQuery.trim() }
        });
        
        // Handlers correctly map incoming standardized backend properties array values
        setResults(res.data?.products || []);
      } catch (err) {
        console.error("Inventory database search execution error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [searchQuery]);

  const handleSearchExecute = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in font-body text-xs text-muted-gray select-none">
      
      {/* Central Search Modification Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form 
          onSubmit={handleSearchExecute} 
          className="relative w-full h-12 bg-card-dark border border-border-dark rounded-xl overflow-hidden focus-within:border-primary-gold transition-colors shadow-md flex items-center pr-2 group"
        >
          <input
            type="text"
            disabled={loading}
            placeholder="Search helmets, carbon gloves, crash guards, or specific categories..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full h-full bg-transparent pl-4 pr-12 text-sm text-pure-white focus:outline-none font-heading tracking-wide placeholder:text-muted-gray/30 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={loading || !localQuery.trim()}
            className="h-9 w-10 bg-primary-gold text-deep-black rounded-lg flex items-center justify-center hover:bg-gold-hover transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-95 duration-100"
          >
            <Search size={16} />
          </button>
        </form>
        
        {searchQuery && !loading && (
          <p className="text-xs text-muted-gray mt-2.5 text-center font-semibold animate-fade-in">
            Search Diagnostic: Showing catalog matches for <span className="text-primary-gold font-bold">"{searchQuery}"</span>
          </p>
        )}
      </div>

      {/* Main Content Dynamic Grid Output Terminal */}
      <div className="border-t border-border-dark/30 pt-6">
        <div className="flex justify-between items-center border-b border-border-dark/60 pb-3 mb-6">
          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-muted-gray">
            {loading ? "Scanning Central Repositories..." : `Intersecting Catalogue Output Results (${results.length})`}
          </h3>
        </div>

        {/* FIXED (Issue 4): Conditional Layout State Matrix Render Blocks */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3 animate-pulse">
            <Loader2 size={24} className="animate-spin text-primary-gold" />
            <span>SCANNING LIVE INVENTORY DATABASE MATRIX...</span>
          </div>
        ) : results.length === 0 ? (
          /* Empty Search Fallback Template Grid */
          <div className="w-full border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center py-16 animate-fade-in">
            <HelpCircle size={44} className="text-muted-gray mx-auto mb-3 animate-pulse" />
            <h4 className="font-heading font-bold uppercase text-pure-white tracking-wide">No Direct Matches Located</h4>
            <p className="text-xs text-muted-gray max-w-sm mx-auto mt-1.5 leading-relaxed normal-case font-medium">
              We couldn't track down matching parts matching <span className="text-primary-gold font-bold font-mono">"{searchQuery || localQuery}"</span> string parameters. Try searching broader terms like <span className="text-primary-gold font-bold">"helmets"</span>, <span className="text-primary-gold font-bold">"gloves"</span>, or structural motorcycle make specifications.
            </p>
            <button 
              type="button"
              onClick={() => navigate("/shop")} 
              className="h-10 px-5 bg-deep-black border border-border-dark text-primary-gold text-xs font-heading font-bold uppercase tracking-wider rounded-lg mt-6 hover:border-primary-gold hover:shadow-md transition-all transform active:scale-95 duration-100"
            >
              Browse Complete Inventory
            </button>
          </div>
        ) : (
          /* FIXED (Issue 2 & Issue 3): Unified Multi-Grid Output processing mapped variables cleanly through ProductCard */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {results.map((productItem) => (
              <ProductCard 
                key={productItem._id} 
                product={productItem} 
                fitmentStatus="neutral" // Enables the component to evaluate machine compatibility against the garage context automatically
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SearchPage;