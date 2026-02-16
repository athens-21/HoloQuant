import { Brain, Activity, Zap } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import * as React from "react";

interface ModelData {
  model: string;
  score: number;
}

interface AnalysisApiResponse {
  symbol: string;
  consensus_score: number;
  signal: string;
  models: {
    technical_rating: number;
    reversion: number;
    ma_rating: number;
    momentum: number;
  };
  oscillators?: {
    rsi_14: number | null;
    stoch_k: number | null;
    stoch_rsi_fast: number | null;
    macd: number | null;
    williams_r: number | null;
    adx: number | null;
    momentum: number | null;
    cci: number | null;
    awesome_osc: number | null;
    uo: number | null;
  };
  asset_data: {
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
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface OscillatorData {
  name: string;
  value: number | null;
  signal: string;
}

interface QuantLogicProps {
  selectedSymbol: string;
}

export function QuantLogic({ selectedSymbol }: QuantLogicProps) {
  const [radarData, setRadarData] = useState<ModelData[]>([]);
  const [alphaScore, setAlphaScore] = useState<number>(0);
  const [signal, setSignal] = useState<string>("NEUTRAL");
  const [oscillators, setOscillators] = useState<OscillatorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysis(selectedSymbol);
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAnalysis(selectedSymbol);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const fetchAnalysis = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/analyze/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AnalysisApiResponse = await response.json();
      
      // Transform the data for the radar chart with new model names
      const chartData: ModelData[] = [
        { model: "Technical", score: data.models.technical_rating },
        { model: "Reversion", score: data.models.reversion },
        { model: "MA Rating", score: data.models.ma_rating },
        { model: "Momentum", score: data.models.momentum },
      ];
      
      setRadarData(chartData);
      setAlphaScore(data.consensus_score);
      setSignal(data.signal);
      
      // Process oscillators data
      if (data.oscillators) {
        const getSignal = (value: number | null, type: string): string => {
          if (value === null || value === undefined) return "เป็นกลาง";
          
          if (type === "rsi" || type === "stoch") {
            if (value < 30) return "ขาย";
            if (value > 70) return "ซื้อ";
            return "เป็นกลาง";
          }
          if (type === "macd") {
            return value > 0 ? "ซื้อ" : "ขาย";
          }
          if (type === "williams") {
            if (value < -80) return "ขาย";
            if (value > -20) return "ซื้อ";
            return "เป็นกลาง";
          }
          return "เป็นกลาง";
        };
        
        const oscData: OscillatorData[] = [
          { name: "Relative Strength Index (14)", value: data.oscillators.rsi_14, signal: getSignal(data.oscillators.rsi_14, "rsi") },
          { name: "สโตแคสติก %K (14, 3, 3)", value: data.oscillators.stoch_k, signal: getSignal(data.oscillators.stoch_k, "stoch") },
          { name: "Stochastic RSI Fast (3, 3, 14, 14)", value: data.oscillators.stoch_rsi_fast, signal: getSignal(data.oscillators.stoch_rsi_fast, "stoch") },
          { name: "ระดับ MACD (12, 26)", value: data.oscillators.macd, signal: getSignal(data.oscillators.macd, "macd") },
          { name: "Williams Percent Range (14)", value: data.oscillators.williams_r, signal: getSignal(data.oscillators.williams_r, "williams") },
          { name: "Average Directional Index (14)", value: data.oscillators.adx, signal: getSignal(data.oscillators.adx, "other") },
          { name: "โมเมนตัม (10)", value: data.oscillators.momentum, signal: getSignal(data.oscillators.momentum, "other") },
          { name: "Commodity Channel Index (20)", value: data.oscillators.cci, signal: getSignal(data.oscillators.cci, "other") },
          { name: "Awesome Oscillator", value: data.oscillators.awesome_osc, signal: getSignal(data.oscillators.awesome_osc, "other") },
          { name: "Ultimate Oscillator (7,14,28)", value: data.oscillators.uo, signal: getSignal(data.oscillators.uo, "other") },
        ];
        setOscillators(oscData);
      }
    } catch (error) {
      console.error("Failed to fetch analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to backend";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (alphaScore / 100) * circumference;

  const getSignalColor = (signal: string) => {
    if (signal.includes("BUY")) return "text-positive bg-positive/10";
    if (signal.includes("SELL")) return "text-negative bg-negative/10";
    return "text-muted-foreground bg-accent";
  };

  return (
    <div className="flex flex-col rounded-md border border-border bg-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Brain className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Quant Logic</span>
          <span className="text-[10px] text-muted-foreground ml-1">• {selectedSymbol}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-positive font-medium">
          <Activity className="h-3 w-3" />
          Active
        </div>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center pt-6 pb-4 border-b border-border">
        {error ? (
          <div className="flex flex-col items-center justify-center h-28">
            <span className="text-xs text-negative mb-2">Connection Error</span>
            <button 
              onClick={() => fetchAnalysis(selectedSymbol)}
              className="mt-2 px-3 py-1 text-[11px] rounded bg-primary/10 text-primary hover:bg-primary/20"
            >
              Retry
            </button>
          </div>
        ) : loading && alphaScore === 0 ? (
          <div className="flex items-center justify-center h-28">
            <span className="text-xs text-muted-foreground">Loading analysis...</span>
          </div>
        ) : (
          <>
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--surface-3))" strokeWidth="5" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--positive))"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ "--gauge-target": `${offset}` } as React.CSSProperties}
                  className="animate-gauge-fill"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-bold text-foreground tabular-nums">{alphaScore}</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Alpha</span>
              </div>
            </div>

            {/* Signal */}
            <div className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded ${getSignalColor(signal)}`}>
              <Zap className="h-3 w-3" />
              <span className="font-mono text-[11px] font-semibold tracking-wider">{signal}</span>
            </div>
          </>
        )}
      </div>

      {/* Radar */}
      <div className="flex-1 min-h-0 px-4 pt-3">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Model Consensus</span>
        <ResponsiveContainer width="100%" height={170}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="68%">
            <PolarGrid stroke="hsl(240 4% 15%)" strokeDasharray="2 2" />
            <PolarAngleAxis dataKey="model" tick={{ fontSize: 10, fill: "hsl(0 0% 45%)" }} />
            <Radar dataKey="score" stroke="hsl(220 70% 55%)" fill="hsl(220 70% 55%)" fillOpacity={0.08} strokeWidth={1.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-px bg-border mx-4 mb-3 rounded overflow-hidden">
        {radarData.map((d) => (
          <div key={d.model} className="flex items-center justify-between px-2.5 py-1.5 bg-card">
            <span className="text-[10px] text-muted-foreground">{d.model}</span>
            <span className="font-mono text-[11px] font-semibold text-foreground tabular-nums">{d.score}</span>
          </div>
        ))}
      </div>

      {/* Oscillators Table */}
      <div className="mx-4 mb-4">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Oscillators</span>
        <div className="mt-2 border border-border rounded overflow-hidden">
          <div className="max-h-[180px] overflow-y-auto">
            {oscillators.length > 0 ? (
              <table className="w-full text-[10px]">
                <thead className="bg-accent/50 sticky top-0">
                  <tr>
                    <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">ชื่อ</th>
                    <th className="text-right px-2 py-1.5 font-medium text-muted-foreground">มูลค่า</th>
                    <th className="text-center px-2 py-1.5 font-medium text-muted-foreground">คำนึกการ</th>
                  </tr>
                </thead>
                <tbody>
                  {oscillators.map((osc, idx) => (
                    <tr key={idx} className="border-t border-border/50 hover:bg-accent/20">
                      <td className="px-2 py-1.5 text-foreground">{osc.name}</td>
                      <td className="px-2 py-1.5 text-right font-mono tabular-nums text-foreground">
                        {osc.value !== null ? osc.value.toFixed(3) : "—"}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium ${
                          osc.signal === "ซื้อ" ? "bg-positive/10 text-positive" :
                          osc.signal === "ขาย" ? "bg-negative/10 text-negative" :
                          "bg-accent text-muted-foreground"
                        }`}>
                          {osc.signal}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-2 py-3 text-center text-muted-foreground">
                ไม่มีข้อมูล Oscillators
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
