# API Quick Reference

## Base URL
```
http://localhost:8000
```

## Endpoints

### 1. Assets Endpoint
**GET** `/api/assets/{category}`

**Parameters:**
- `category`: `all` | `stocks` | `crypto` | `forex`

**Response:**
```json
{
  "category": "stocks",
  "assets": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "price": 198.45,
      "change": 2.34,
      "rsi": 65.4,
      "macd": 1.2
    }
  ],
  "count": 4
}
```

---

### 2. Analysis Endpoint
**GET** `/api/analyze/{symbol}`

**Parameters:**
- `symbol`: Any ticker symbol (e.g., `AAPL`, `BTC`, `EUR/USD`)

**Response:**
```json
{
  "symbol": "AAPL",
  "consensus_score": 78,
  "signal": "STRONG BUY",
  "models": {
    "trend": 82,
    "reversion": 65,
    "volume": 91,
    "z_score": 74
  },
  "asset_data": {
    "ticker": "AAPL",
    "name": "Apple Inc.",
    "price": 198.45,
    "change": 2.34,
    "rsi": 65.4,
    "macd": 1.2
  }
}
```

**Signal Types:**
- `STRONG BUY` (consensus >= 70)
- `BUY` (consensus >= 55)
- `NEUTRAL` (consensus >= 45)
- `SELL` (consensus >= 30)
- `STRONG SELL` (consensus < 30)

---

### 3. News Endpoint
**GET** `/api/news/{symbol}`

**Parameters:**
- `symbol`: Any ticker symbol or `MARKET` for general news

**Response:**
```json
{
  "symbol": "AAPL",
  "news": [
    {
      "headline": "AAPL reports strong Q4 earnings, beating analyst expectations",
      "source": "Reuters",
      "time": "45m",
      "sentiment": "positive",
      "sentiment_score": 0.75
    }
  ],
  "count": 6,
  "average_sentiment": 0.42
}
```

**Sentiment Types:**
- `positive` (score > 0.3)
- `negative` (score < -0.3)
- `neutral` (score between -0.3 and 0.3)

---

## Testing with cURL

### Get all assets
```bash
curl http://localhost:8000/api/assets/all
```

### Get stock data only
```bash
curl http://localhost:8000/api/assets/stocks
```

### Analyze AAPL
```bash
curl http://localhost:8000/api/analyze/AAPL
```

### Get news for BTC
```bash
curl http://localhost:8000/api/news/BTC
```

---

## Testing with Browser

Simply visit:
- http://localhost:8000/docs (Interactive API docs)
- http://localhost:8000/api/assets/all
- http://localhost:8000/api/analyze/AAPL
- http://localhost:8000/api/news/MARKET
