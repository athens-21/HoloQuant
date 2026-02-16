import { ArrowRight, BarChart3, Newspaper, Brain, TrendingUp, TrendingDown, Zap, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const topMovers = [
  { ticker: "NVDA", change: 5.12 },
  { ticker: "SOL", change: 8.42 },
  { ticker: "TSLA", change: -2.91 },
  { ticker: "BTC", change: -1.28 },
];

const headlines = [
  { text: "Fed signals potential rate cuts in Q3", sentiment: "positive" as const },
  { text: "China PMI contracts for third month", sentiment: "negative" as const },
  { text: "Bitcoin ETF inflows hit record $1.2B", sentiment: "positive" as const },
];

const sentimentClass = { positive: "bg-positive-subtle", negative: "bg-negative-subtle" };

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-12 border-b border-border bg-card">
        <div className="flex items-center gap-2.5">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground tracking-tight">HoloQuant Pro</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors duration-150"
        >
          Open Dashboard <ArrowRight className="h-3 w-3" />
        </button>
      </header>

      {/* Hero */}
      <div className="px-6 pt-12 pb-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Quantitative Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
          Real-time asset tracking, market intelligence and model-driven signals — unified in one workspace.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="flex-1 px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-min">

          {/* Module 1 — Asset Explorer */}
          <div
            onClick={() => navigate("/dashboard")}
            className="group rounded-md border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-colors duration-150"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Asset Explorer</span>
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            </div>

            <div className="space-y-0">
              {topMovers.map((m) => (
                <div key={m.ticker} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-surface-3 flex items-center justify-center text-[8px] font-mono font-semibold text-muted-foreground">
                      {m.ticker.slice(0, 2)}
                    </div>
                    <span className="text-xs font-medium text-foreground">{m.ticker}</span>
                  </div>
                  <div className={`flex items-center gap-0.5 ${m.change >= 0 ? "text-positive" : "text-negative"}`}>
                    {m.change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    <span className="font-mono text-[10px] font-medium tabular-nums">
                      {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground mt-3">8 assets across Stocks, Crypto & Forex</p>
          </div>

          {/* Module 2 — Market Intelligence */}
          <div
            onClick={() => navigate("/dashboard")}
            className="group rounded-md border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-colors duration-150"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Market Intelligence</span>
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            </div>

            <div className="space-y-0">
              {headlines.map((h, i) => (
                <div key={i} className="py-2 border-b border-border/50 last:border-0">
                  <p className="text-xs leading-relaxed text-foreground">{h.text}</p>
                  <span className={`inline-block mt-1 px-1.5 py-px rounded text-[8px] font-semibold uppercase tracking-wide ${sentimentClass[h.sentiment]}`}>
                    {h.sentiment}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground mt-3">6 articles in today's briefing</p>
          </div>

          {/* Module 3 — Quant Logic */}
          <div
            onClick={() => navigate("/dashboard")}
            className="group rounded-md border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-colors duration-150"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Quant Logic</span>
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            </div>

            {/* Mini gauge */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--surface-3))" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="hsl(var(--positive))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 - (78 / 100) * 2 * Math.PI * 42}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-sm font-bold text-foreground tabular-nums">78</span>
                  <span className="text-[7px] uppercase tracking-widest text-muted-foreground">Alpha</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-positive/10">
                  <Zap className="h-2.5 w-2.5 text-positive" />
                  <span className="font-mono text-[10px] font-semibold text-positive tracking-wider">STRONG BUY</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                  {[{ m: "Trend", s: 82 }, { m: "Vol", s: 91 }, { m: "Rev", s: 65 }, { m: "Z", s: 74 }].map(d => (
                    <div key={d.m} className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">{d.m}</span>
                      <span className="font-mono font-medium text-foreground tabular-nums">{d.s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground">4-model consensus across Trend, Reversion, Volume & Z-Score</p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 h-8 flex items-center border-t border-border">
        <span className="text-[10px] text-muted-foreground">HoloQuant Pro · Quantitative Dashboard</span>
      </footer>
    </div>
  );
}
