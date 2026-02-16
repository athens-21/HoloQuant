import { TrendingUp, TrendingDown, ArrowUpRight, BarChart3, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// TypeScript interface matching the backend JSON response with tvscreener fields
interface AssetData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  rsi: number;
  stoch_rsi: number;
  volume: number;
  technical_rating: number;
  ma_rating: number;
  donchian_upper: number;
}

interface ApiResponse {
  category: string;
  assets: AssetData[];
  count: number;
}

const categories = ["All", "Stocks", "Crypto", "Forex"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface AssetExplorerProps {
  onSelectSymbol: (symbol: string) => void;
  selectedSymbol: string;
}

export function AssetExplorer({ onSelectSymbol, selectedSymbol }: AssetExplorerProps) {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAssets(selectedCategory);
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAssets(selectedCategory);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const fetchAssets = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryParam = category.toLowerCase();
      const response = await fetch(`${API_BASE_URL}/api/assets/${categoryParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      setAssets(data.assets || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to backend";
      setError(errorMessage);
      // Keep existing data on error instead of clearing
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Filter assets based on search query
  const filteredAssets = assets
    .filter(asset => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        asset.ticker.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      // Sort by volume (descending) - highest volume first
      return (b.volume || 0) - (a.volume || 0);
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };
  return (
    <div className="flex flex-col rounded-md border border-border bg-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-border">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Asset Explorer</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{assets.length} items</span>
      </div>

      {/* Filters */}
      <div className="flex gap-0.5 px-4 py-2 border-b border-border">
        {categories.map((cat) =>
        <button
          key={cat}
          onClick={() => handleCategoryClick(cat)}
          className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors duration-150 ${
          selectedCategory === cat ?
          "bg-primary/10 text-primary" :
          "text-muted-foreground hover:text-foreground hover:bg-accent"}`
          }>

            {cat}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-1.5 border-b border-border">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Asset</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-right">Price</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-right w-14">Chg%</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <span className="text-xs text-negative mb-2">Connection Error</span>
            <span className="text-[10px] text-muted-foreground text-center">{error}</span>
            <button 
              onClick={() => fetchAssets(selectedCategory)}
              className="mt-3 px-3 py-1 text-[11px] rounded bg-primary/10 text-primary hover:bg-primary/20"
            >
              Retry
            </button>
          </div>
        ) : loading && assets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-muted-foreground">Loading assets...</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-muted-foreground">No assets found</span>
          </div>
        ) : (
          paginatedAssets.map((asset) =>
          <div
            key={asset.ticker}
            onClick={() => onSelectSymbol(asset.ticker)}
            className={`grid grid-cols-[1fr_auto_auto] gap-2 items-center px-4 py-2 border-b border-border/50 cursor-pointer transition-all duration-150 ${
              selectedSymbol === asset.ticker
                ? "bg-primary/10 hover:bg-primary/15 border-l-2 border-l-primary"
                : "hover:bg-accent/40"
            }`}>

              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-mono font-semibold text-muted-foreground shrink-0 bg-violet-100">
                  {asset.ticker.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{asset.ticker}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{asset.name}</p>
                </div>
              </div>

              <span className="font-mono text-xs text-foreground tabular-nums">
                {asset.price < 10 ? asset.price.toFixed(4) : asset.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>

              <div className={`flex items-center justify-end gap-0.5 w-14 ${asset.change >= 0 ? "text-positive" : "text-negative"}`}>
                {asset.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span className="font-mono text-[11px] font-medium tabular-nums">
                  {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Footer with Pagination */}
      <div className="border-t border-border">
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 px-4 py-2 border-b border-border">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-2 py-0.5 text-[11px] rounded font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="text-[11px] text-muted-foreground px-1">...</span>
            )}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        
        <div className="flex items-center justify-between px-4 h-8">
          <span className="text-[10px] text-muted-foreground">
            {filteredAssets.length > 0 
              ? `${startIndex + 1}-${Math.min(endIndex, filteredAssets.length)} of ${filteredAssets.length}` 
              : '0 items'}
          </span>
          <span className="text-[10px] text-muted-foreground">Updated {getTimeSinceUpdate()}</span>
        </div>
      </div>
    </div>);

}