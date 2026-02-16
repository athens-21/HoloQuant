from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal, Optional
import random

# Try to import tvscreener, but don't crash if not available
try:
    import tvscreener as tvs
    import pandas as pd
    import numpy as np
    TVSCREENER_AVAILABLE = True
    pd_available = True
    np_available = True
    print("✅ tvscreener is available")
except ImportError:
    TVSCREENER_AVAILABLE = False
    pd_available = False
    np_available = False
    pd = None
    np = None
    print("⚠️  tvscreener not available - using mock data only")

app = FastAPI(title="HoloQuant API", version="1.0.0")

# CORS configuration - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def convert_to_native_types(value):
    """Convert numpy/pandas types to native Python types for JSON serialization"""
    if pd and isinstance(value, (pd.Series, pd.DataFrame)):
        return value.to_dict() if isinstance(value, pd.Series) else value.to_dict('records')
    if np and isinstance(value, (np.integer, np.floating)):
        return float(value) if isinstance(value, np.floating) else int(value)
    if isinstance(value, (np.bool_)):
        return bool(value)
    if pd and pd.isna(value):
        return None
    return value

def get_fallback_data(asset_type: str):
    """Fallback mock data if tvscreener fails or is unavailable"""
    fallback = {
        "stocks": [
            {"ticker": "AAPL", "name": "Apple Inc.", "price": 198.45, "change": 2.34, "rsi": 65.4, "stoch_rsi": 72.3, "volume": 50000000, "technical_rating": 0.8, "ma_rating": 0.9, "donchian_upper": 205.30},
            {"ticker": "NVDA", "name": "NVIDIA Corp.", "price": 875.30, "change": 5.12, "rsi": 72.1, "stoch_rsi": 85.2, "volume": 40000000, "technical_rating": 1.0, "ma_rating": 1.0, "donchian_upper": 920.50},
            {"ticker": "TSLA", "name": "Tesla Inc.", "price": 245.60, "change": -2.91, "rsi": 48.2, "stoch_rsi": 35.8, "volume": 60000000, "technical_rating": -0.2, "ma_rating": -0.1, "donchian_upper": 265.80},
            {"ticker": "MSFT", "name": "Microsoft", "price": 425.18, "change": 1.05, "rsi": 58.7, "stoch_rsi": 62.5, "volume": 35000000, "technical_rating": 0.6, "ma_rating": 0.7, "donchian_upper": 445.25},
            {"ticker": "GOOGL", "name": "Alphabet", "price": 142.35, "change": 0.85, "rsi": 55.3, "stoch_rsi": 58.7, "volume": 25000000, "technical_rating": 0.4, "ma_rating": 0.5, "donchian_upper": 148.90},
        ],
        "crypto": [
            {"ticker": "BTCUSD", "name": "Bitcoin", "price": 67842.10, "change": -1.28, "rsi": 55.3, "stoch_rsi": 52.1, "volume": 1000000, "technical_rating": 0.2, "ma_rating": 0.3, "donchian_upper": 72000.00},
            {"ticker": "ETHUSD", "name": "Ethereum", "price": 3521.80, "change": 3.67, "rsi": 62.8, "stoch_rsi": 68.9, "volume": 500000, "technical_rating": 0.7, "ma_rating": 0.8, "donchian_upper": 3850.00},
            {"ticker": "SOLUSD", "name": "Solana", "price": 142.35, "change": 8.42, "rsi": 78.5, "stoch_rsi": 92.3, "volume": 300000, "technical_rating": 0.9, "ma_rating": 1.0, "donchian_upper": 165.00},
        ],
        "forex": [
            {"ticker": "EURUSD", "name": "Euro/Dollar", "price": 1.0842, "change": 0.15, "rsi": 51.2, "stoch_rsi": 54.3, "volume": 100000, "technical_rating": 0.1, "ma_rating": 0.2, "donchian_upper": 1.0950},
            {"ticker": "GBPUSD", "name": "British Pound/Dollar", "price": 1.2654, "change": -0.23, "rsi": 47.8, "stoch_rsi": 42.1, "volume": 80000, "technical_rating": -0.3, "ma_rating": -0.2, "donchian_upper": 1.2820},
        ]
    }
    return fallback.get(asset_type, [])

# Helper function to get screener data with specific tvscreener fields
def get_screener_data(asset_type: str):
    """
    Fetch real data from tvscreener with correct column names
    Returns: List of dictionaries with asset data
    """
    # If tvscreener is not available, use fallback immediately
    if not TVSCREENER_AVAILABLE:
        return get_fallback_data(asset_type)
    
    try:
        # Instantiate screener based on asset type
        if asset_type == "stocks":
            screener = tvs.StockScreener()
        elif asset_type == "crypto":
            screener = tvs.CryptoScreener()
        elif asset_type == "forex":
            screener = tvs.ForexScreener()
        else:
            return []
        
        # Get all data from tvscreener (no select needed)
        df = screener.get()
        
        # Ensure we have data
        if df is None or df.empty:
            print(f"⚠️  tvscreener returned empty data for {asset_type}, using fallback")
            return get_fallback_data(asset_type)
        
        # Filter out garbage data: Price not null and volume > 0
        if "Price" in df.columns:
            df = df[df["Price"].notna()]
            if "Volume" in df.columns:
                df = df[df["Volume"] > 0]
        
        # Limit to top 20 assets by volume (or first 20 if no volume)
        if len(df) > 20:
            if "Volume" in df.columns:
                df = df.nlargest(20, "Volume")
            else:
                # For assets without volume (e.g. forex), take first 20
                df = df.head(20)
        
        # Transform to match our expected format with native Python types
        assets = []
        for symbol, row in df.iterrows():
            # Get change% - tvscreener gives it as percentage already
            change_val = row.get("Change %", row.get("Change", 0))
            
            # Get RSI
            rsi_val = row.get("Relative Strength Index (14)", 50)
            
            # Get Stoch RSI (use Fast version)
            stoch_rsi_val = row.get("Stochastic RSI Fast (3, 3, 14, 14)", 50)
            
            # Get Technical Rating (-1 to 1)
            tech_rating = row.get("Technical Rating", 0)
            
            # Get Moving Averages Rating (-1 to 1)
            ma_rating = row.get("Moving Averages Rating", 0)
            
            # Get Donchian Channel Upper
            donchian = row.get("Donchian Channels Upper Band (20)", 0)
            
            # Get Name and Symbol - use Name as ticker if available
            name = row.get("Name", row.get("Description", symbol))
            # Clean ticker: remove .P suffix if exists, use actual symbol column if available
            ticker = str(name).replace(".P", "").replace(".US", "")
            
            asset = {
                "ticker": ticker,
                "name": str(name),
                "price": convert_to_native_types(row.get("Price", 0)),
                "change": convert_to_native_types(change_val),
                "rsi": convert_to_native_types(rsi_val),
                "stoch_rsi": convert_to_native_types(stoch_rsi_val),
                "volume": convert_to_native_types(row.get("Volume", 0)),
                "technical_rating": convert_to_native_types(tech_rating),
                "ma_rating": convert_to_native_types(ma_rating),
                "donchian_upper": convert_to_native_types(donchian)
            }
            assets.append(asset)
        
        print(f"✅ Fetched {len(assets)} {asset_type} from tvscreener (REAL DATA)")
        return assets
        
    except Exception as e:
        print(f"⚠️  Error fetching {asset_type} from tvscreener: {str(e)}")
        print(f"📊 Using fallback mock data for {asset_type}")
        import traceback
        traceback.print_exc()
        # Return fallback mock data if tvscreener fails
        return get_fallback_data(asset_type)

@app.get("/")
def read_root():
    return {
        "message": "HoloQuant API",
        "version": "1.0.0",
        "tvscreener_status": "available" if TVSCREENER_AVAILABLE else "unavailable (using mock data)",
        "endpoints": {
            "assets": "/api/assets/{category}",
            "screener": "/api/screener/{asset_type}",
            "analyze": "/api/analyze/{symbol}",
            "news": "/api/news/{symbol}"
        }
    }

@app.get("/api/assets/{category}")
def get_assets(category: Literal["stocks", "crypto", "forex", "all"]):
    """
    Get assets by category using tvscreener (or mock data)
    Fields: ticker, name, price, change, rsi, macd, volume
    """
    try:
        if category == "all":
            all_assets = []
            for asset_type in ["stocks", "crypto", "forex"]:
                assets = get_screener_data(asset_type)
                all_assets.extend(assets)
            return {"category": category, "assets": all_assets, "count": len(all_assets)}
        
        category_lower = category.lower()
        if category_lower not in ["stocks", "crypto", "forex"]:
            raise HTTPException(status_code=404, detail=f"Category '{category}' not found")
        
        assets = get_screener_data(category_lower)
        return {"category": category, "assets": assets, "count": len(assets)}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_assets: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/screener/{asset_type}")
def get_screener(asset_type: Literal["stock", "crypto", "forex"]):
    """
    Alternative endpoint for screener data (singular form)
    """
    # Convert singular to plural for consistency
    asset_type_plural = asset_type + "s" if asset_type != "forex" else asset_type
    return get_assets(asset_type_plural)

@app.get("/api/analyze/{symbol}")
def analyze_symbol(symbol: str):
    """
    Calculate Consensus Score (0-100) using 4 models + detailed oscillators
    """
    try:
        # Find the asset from all screener data and get full row data
        asset = None
        asset_row = None
        
        for asset_type in ["stocks", "crypto", "forex"]:
            # Get the full DataFrame to access all oscillators
            if not TVSCREENER_AVAILABLE:
                assets = get_fallback_data(asset_type)
                for a in assets:
                    if a["ticker"].upper() == symbol.upper():
                        asset = a
                        break
            else:
                try:
                    if asset_type == "stocks":
                        screener = tvs.StockScreener()
                    elif asset_type == "crypto":
                        screener = tvs.CryptoScreener()
                    else:
                        screener = tvs.ForexScreener()
                    
                    df = screener.get()
                    if df is not None and not df.empty:
                        # Search by name in DataFrame
                        for idx, row in df.iterrows():
                            row_name = str(row.get("Name", "")).replace(".P", "").replace(".US", "")
                            if row_name.upper() == symbol.upper() or str(idx).upper() == symbol.upper():
                                asset_row = row
                                # Build asset dict
                                asset = {
                                    "ticker": row_name,
                                    "name": str(row.get("Name", "")),
                                    "price": convert_to_native_types(row.get("Price", 0)),
                                    "change": convert_to_native_types(row.get("Change %", 0)),
                                    "rsi": convert_to_native_types(row.get("Relative Strength Index (14)", 50)),
                                    "stoch_rsi": convert_to_native_types(row.get("Stochastic RSI Fast (3, 3, 14, 14)", 50)),
                                    "volume": convert_to_native_types(row.get("Volume", 0)),
                                    "technical_rating": convert_to_native_types(row.get("Technical Rating", 0)),
                                    "ma_rating": convert_to_native_types(row.get("Moving Averages Rating", 0)),
                                    "donchian_upper": convert_to_native_types(row.get("Donchian Channels Upper Band (20)", 0))
                                }
                                break
                except:
                    pass
            
            if asset:
                break
        
        if not asset:
            raise HTTPException(status_code=404, detail=f"Symbol '{symbol}' not found")
        
        # Extract oscillators data if we have full row
        oscillators = {}
        if asset_row is not None:
            oscillators = {
                "rsi_14": convert_to_native_types(asset_row.get("Relative Strength Index (14)", None)),
                "stoch_k": convert_to_native_types(asset_row.get("Stochastic %K (14, 3, 3)", None)),
                "stoch_rsi_fast": convert_to_native_types(asset_row.get("Stochastic RSI Fast (3, 3, 14, 14)", None)),
                "macd": convert_to_native_types(asset_row.get("MACD Level (12, 26)", None)),
                "williams_r": convert_to_native_types(asset_row.get("Williams Percent Range (14)", None)),
                "adx": convert_to_native_types(asset_row.get("Average Directional Index (14)", None)),
                "momentum": convert_to_native_types(asset_row.get("Momentum (10)", None)),
                "cci": convert_to_native_types(asset_row.get("Commodity Channel Index (20)", None)),
                "awesome_osc": convert_to_native_types(asset_row.get("Awesome Oscillator", None)),
                "uo": convert_to_native_types(asset_row.get("Ultimate Oscillator (7, 14, 28)", None)),
            }
        
        # Calculate model scores (0-100)
        technical_rating = asset.get("technical_rating", 0)
        trend_score = int(50 + (technical_rating * 50))
        trend_score = min(100, max(0, trend_score))
        
        stoch_rsi = asset.get("stoch_rsi", 50)
        if stoch_rsi < 20:
            reversion_score = 90
        elif stoch_rsi < 30:
            reversion_score = 75
        elif stoch_rsi > 80:
            reversion_score = 10
        elif stoch_rsi > 70:
            reversion_score = 25
        else:
            reversion_score = 50 + (50 - stoch_rsi) * 0.5
        reversion_score = int(min(100, max(0, reversion_score)))
        
        ma_rating = asset.get("ma_rating", 0)
        ma_score = int(50 + (ma_rating * 50))
        ma_score = min(100, max(0, ma_score))
        
        rsi = asset.get("rsi", 50)
        change = asset.get("change", 0)
        rsi_component = 50 + (rsi - 50)
        price_component = 50 + (change * 5)
        momentum_score = int((rsi_component * 0.6 + price_component * 0.4))
        momentum_score = min(100, max(0, momentum_score))
        
        consensus = int((trend_score * 0.35 + reversion_score * 0.25 + 
                        ma_score * 0.25 + momentum_score * 0.15))
        
        if consensus >= 75:
            signal = "STRONG BUY"
        elif consensus >= 60:
            signal = "BUY"
        elif consensus >= 40:
            signal = "NEUTRAL"
        elif consensus >= 25:
            signal = "SELL"
        else:
            signal = "STRONG SELL"
        
        return {
            "symbol": symbol.upper(),
            "consensus_score": consensus,
            "signal": signal,
            "models": {
                "technical_rating": trend_score,
                "reversion": reversion_score,
                "ma_rating": ma_score,
                "momentum": momentum_score
            },
            "oscillators": oscillators,
            "asset_data": asset
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error analyzing {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news/{symbol}")
def get_news(symbol: str):
    """
    Generate Technical Intelligence based on screener data
    Since tvscreener is numerical, create insights from technical indicators
    """
    try:
        # Find the asset from screener data
        asset = None
        for asset_type in ["stocks", "crypto", "forex"]:
            assets = get_screener_data(asset_type)
            for a in assets:
                if a["ticker"].upper() == symbol.upper():
                    asset = a
                    break
            if asset:
                break
        
        if not asset:
            raise HTTPException(status_code=404, detail=f"Symbol '{symbol}' not found")
        
        # Generate technical intelligence items based on indicators
        news_items = []
        
        # 1. Technical Rating Analysis
        technical_rating = asset.get("technical_rating", 0)
        if technical_rating > 0.5:
            news_items.append({
                "headline": f"{symbol.upper()} shows Strong Buy signal on Technical Analysis",
                "source": "HoloQuant Technical",
                "time": "5m",
                "sentiment": "positive",
                "sentiment_score": round(technical_rating, 2)
            })
        elif technical_rating < -0.5:
            news_items.append({
                "headline": f"{symbol.upper()} Technical indicators signal caution",
                "source": "HoloQuant Technical",
                "time": "5m",
                "sentiment": "negative",
                "sentiment_score": round(technical_rating, 2)
            })
        
        # 2. Moving Average Analysis
        ma_rating = asset.get("ma_rating", 0)
        if ma_rating > 0.6:
            news_items.append({
                "headline": f"{symbol.upper()} crosses above key moving averages, momentum building",
                "source": "HoloQuant MA",
                "time": "12m",
                "sentiment": "positive",
                "sentiment_score": round(ma_rating, 2)
            })
        elif ma_rating < -0.6:
            news_items.append({
                "headline": f"{symbol.upper()} breaks below moving average support levels",
                "source": "HoloQuant MA",
                "time": "12m",
                "sentiment": "negative",
                "sentiment_score": round(ma_rating, 2)
            })
        
        # 3. Stochastic RSI Analysis
        stoch_rsi = asset.get("stoch_rsi", 50)
        if stoch_rsi < 20:
            news_items.append({
                "headline": f"{symbol.upper()} enters oversold territory, potential reversal ahead",
                "source": "HoloQuant Oscillator",
                "time": "18m",
                "sentiment": "positive",
                "sentiment_score": 0.7
            })
        elif stoch_rsi > 80:
            news_items.append({
                "headline": f"{symbol.upper()} reaches overbought levels on Stochastic RSI",
                "source": "HoloQuant Oscillator",
                "time": "18m",
                "sentiment": "negative",
                "sentiment_score": -0.7
            })
        
        # 4. RSI Analysis
        rsi = asset.get("rsi", 50)
        if 40 <= rsi <= 60:
            news_items.append({
                "headline": f"{symbol.upper()} maintains healthy momentum in neutral zone",
                "source": "HoloQuant RSI",
                "time": "25m",
                "sentiment": "neutral",
                "sentiment_score": 0.1
            })
        
        # 5. Price Change Analysis
        change = asset.get("change", 0)
        if change > 3:
            news_items.append({
                "headline": f"{symbol.upper()} rallies {change:.2f}% on strong buying pressure",
                "source": "HoloQuant Price",
                "time": "32m",
                "sentiment": "positive",
                "sentiment_score": min(0.9, change / 5)
            })
        elif change < -3:
            news_items.append({
                "headline": f"{symbol.upper()} declines {abs(change):.2f}% amid selling pressure",
                "source": "HoloQuant Price",
                "time": "32m",
                "sentiment": "negative",
                "sentiment_score": max(-0.9, change / 5)
            })
        
        # 6. Donchian Channel Analysis
        donchian_upper = asset.get("donchian_upper", 0)
        price = asset.get("price", 0)
        if donchian_upper > 0 and price > 0:
            proximity = (donchian_upper - price) / price * 100
            if proximity < 2:
                news_items.append({
                    "headline": f"{symbol.upper()} approaches 20-day high at ${donchian_upper:.2f}",
                    "source": "HoloQuant Channels",
                    "time": "45m",
                    "sentiment": "positive",
                    "sentiment_score": 0.65
                })
        
        # Ensure we have at least 3 items
        if len(news_items) < 3:
            news_items.append({
                "headline": f"{symbol.upper()} trading at ${asset.get('price', 0):.2f} with volume of {asset.get('volume', 0):,}",
                "source": "HoloQuant Market",
                "time": "1h",
                "sentiment": "neutral",
                "sentiment_score": 0.0
            })
        
        # Calculate average sentiment
        avg_sentiment = sum(item["sentiment_score"] for item in news_items) / len(news_items)
        
        return {
            "symbol": symbol.upper(),
            "news": news_items[:6],  # Limit to 6 items
            "count": min(len(news_items), 6),
            "average_sentiment": round(avg_sentiment, 2)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating news for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting HoloQuant Backend API...")
    print("📍 Server will run at: http://localhost:8000")
    print("📚 API docs at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
