# 🚀 Quick Start Reference

## One-Command Setup

### Terminal 1 - Backend:
```powershell
cd backend
.\start.bat
```

Wait for: `Uvicorn running on http://0.0.0.0:8000`

### Terminal 2 - Frontend:
```powershell
npm run dev
```

Open: http://localhost:5173

---

## Quick Test URLs

**Backend:**
- Root: http://localhost:8000
- Docs: http://localhost:8000/docs
- Stocks: http://localhost:8000/api/assets/stocks
- Screener: http://localhost:8000/api/screener/stock
- Analysis: http://localhost:8000/api/analyze/AAPL
- News: http://localhost:8000/api/news/MARKET

**Frontend:**
- App: http://localhost:5173

---

## Quick Fixes

### Backend not starting:
```powershell
cd backend
python -m venv venv --clear
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### CORS errors:
Check `backend/main.py` line 12:
```python
allow_origins=["*"],  # Must be "*" not specific URLs
```

### Frontend connection failed:
1. Check backend is running (http://localhost:8000)
2. Check browser console (F12)
3. Verify API_BASE_URL in components:
   ```typescript
   const API_BASE_URL = "http://localhost:8000";
   ```

### Port already in use:
```powershell
# Find process on port 8000
netstat -ano | findstr :8000

# Kill it (replace PID)
taskkill /PID <PID> /F

# Or change port in backend/main.py:
uvicorn.run(app, host="0.0.0.0", port=8001)
```

---

## Key Changes Made

✅ **Backend:**
- CORS: `allow_origins=["*"]`
- tvscreener integration with `df.to_dict(orient="records")`
- Fallback mock data if tvscreener fails
- Both `/api/assets/` and `/api/screener/` endpoints

✅ **Frontend:**
- Complete mock data removal
- TypeScript interfaces match backend JSON
- `useState<AssetData[]>([])` with proper types
- Try/catch error handling
- Retry buttons on errors
- Loading states

---

## Expected Behavior

### On Success:
- ✅ Backend console: `200 OK` for each request
- ✅ Frontend: Tickers display (AAPL, NVDA, BTC, etc.)
- ✅ No CORS errors in browser console
- ✅ Category filters work
- ✅ Auto-refresh every 30s

### On Failure:
- ❌ Red "Connection Error" with Retry button
- ❌ Console shows fetch error
- ❌ Check backend is running

---

## Verify Integration

**Browser Console (F12):**
```javascript
// Test direct fetch
fetch('http://localhost:8000/api/assets/stocks')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e));
```

**Expected Output:**
```json
{
  "category": "stocks",
  "assets": [...],
  "count": 4
}
```

---

## Component State

### AssetExplorer:
- **State:** `assets: AssetData[]`, `loading: boolean`, `error: string | null`
- **Fetches:** `/api/assets/{category}` every 30s
- **Shows:** Ticker, Name, Price, Change%

### MarketIntelligence:
- **State:** `news: NewsItem[]`, `loading: boolean`, `error: string | null`
- **Fetches:** `/api/news/MARKET` every 5m
- **Shows:** Headlines with sentiment badges

### QuantLogic:
- **State:** `alphaScore: number`, `signal: string`, `radarData: ModelData[]`
- **Fetches:** `/api/analyze/AAPL` every 30s
- **Shows:** Gauge, signal, radar chart

---

All integration issues fixed! 🎉
