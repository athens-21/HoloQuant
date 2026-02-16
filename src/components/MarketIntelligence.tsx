import { Newspaper, Clock, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

type Sentiment = "positive" | "negative" | "neutral";

interface NewsItem {
  headline: string;
  source: string;
  time: string;
  sentiment: Sentiment;
  sentiment_score: number;
}

interface NewsApiResponse {
  symbol: string;
  news: NewsItem[];
  count: number;
  average_sentiment: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const sentimentStyle: Record<Sentiment, string> = {
  positive: "bg-positive-subtle",
  negative: "bg-negative-subtle",
  neutral: "bg-accent text-muted-foreground",
};

interface MarketIntelligenceProps {
  selectedSymbol: string;
}

export function MarketIntelligence({ selectedSymbol }: MarketIntelligenceProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews(selectedSymbol);
    // Refresh every 30 seconds to match asset updates
    const interval = setInterval(() => {
      fetchNews(selectedSymbol);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const fetchNews = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/news/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsApiResponse = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to backend";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-md border border-border bg-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Market Intelligence</span>
          <span className="text-[10px] text-muted-foreground ml-1">• {selectedSymbol}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-positive" />
          Live
        </div>
      </div>

      {/* Sub-header */}
      <div className="px-4 py-2 border-b border-border">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Technical Intelligence</span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <span className="text-xs text-negative mb-2">Connection Error</span>
            <span className="text-[10px] text-muted-foreground text-center">{error}</span>
            <button 
              onClick={() => fetchNews(selectedSymbol)}
              className="mt-3 px-3 py-1 text-[11px] rounded bg-primary/10 text-primary hover:bg-primary/20"
            >
              Retry
            </button>
          </div>
        ) : loading && news.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-muted-foreground">Loading news...</span>
          </div>
        ) : news.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-muted-foreground">No news available</span>
          </div>
        ) : (
          news.map((item, i) => (
            <article
              key={i}
              className="px-4 py-3 border-b border-border/50 hover:bg-accent/40 cursor-pointer transition-colors duration-150 group"
            >
              <p className="text-[13px] leading-[1.6] text-foreground font-medium group-hover:text-primary transition-colors duration-150">
                {item.headline}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-1.5 py-px rounded text-[9px] font-semibold uppercase tracking-wide ${sentimentStyle[item.sentiment]}`}>
                  {item.sentiment}
                </span>
                <span className="text-[10px] text-muted-foreground">{item.source}</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  {item.time}
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 h-8 border-t border-border">
        <span className="text-[10px] text-muted-foreground">{news.length} articles</span>
        <button className="flex items-center gap-0.5 text-[11px] text-primary hover:underline">
          Full Briefing <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
