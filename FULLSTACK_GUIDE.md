# HoloQuant - Full Stack Setup Guide

## 🚀 Quick Start

### 1. Start the Backend (Python FastAPI)

Open a terminal in the `backend/` folder and run:

```powershell
# Windows
.\start.bat

# Or manually:
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The backend will start at: **http://localhost:8000**
- API Docs: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json

### 2. Start the Frontend (React + Vite)

Open another terminal in the project root and run:

```powershell
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

## 📡 API Endpoints

### Get Assets by Category
```
GET /api/assets/{category}
```
- **Parameters**: `category` = `all`, `stocks`, `crypto`, or `forex`
- **Returns**: List of assets with ticker, name, price, change%, RSI, MACD

### Analyze Symbol
```
GET /api/analyze/{symbol}
```
- **Parameters**: `symbol` = Any ticker (e.g., `AAPL`, `BTC`)
- **Returns**: Consensus score (0-100), signal, and model breakdown

### Get News for Symbol
```
GET /api/news/{symbol}
```
- **Parameters**: `symbol` = Any ticker
- **Returns**: News articles with sentiment analysis

---

## 🔄 Data Flow

```
React Components → Fetch API → FastAPI Backend → Mock Data/tvscreener
     ↓                                                    ↓
  useState                                         JSON Response
     ↓                                                    ↓
  Render UI ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

### Updated Components:

1. **AssetExplorer.tsx**
   - Fetches from `/api/assets/{category}`
   - Auto-refreshes every 30 seconds
   - Category filter working

2. **MarketIntelligence.tsx**
   - Fetches from `/api/news/MARKET`
   - Auto-refreshes every 5 minutes
   - Shows sentiment badges

3. **QuantLogic.tsx**
   - Fetches from `/api/analyze/AAPL` (default)
   - Auto-refreshes every 30 seconds
   - Shows consensus gauge + radar chart

---

## 🔧 Next Steps (Future Enhancements)

### Integrate Real Data with tvscreener

1. Install tvscreener:
```bash
pip install deepentropy-tvscreener
```

2. Update `backend/main.py` to use real screeners:
```python
from tvscreener import StockScreener, CryptoScreener, ForexScreener

# Replace MOCK_ASSETS with:
screener = StockScreener()
stocks = screener.get_stocks(fields=['ticker', 'close', 'change', 'rsi', 'macd'])
```

### Add Real News

1. Install GoogleNews:
```bash
pip install GoogleNews textblob
```

2. Fetch real articles and calculate sentiment

### Add WebSocket for Real-Time Updates

- Use FastAPI WebSockets for live price updates
- Update frontend to connect via WebSocket

### Add Authentication

- JWT tokens
- User sessions
- Protected routes

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python --version`
- Check if port 8000 is free: `netstat -ano | findstr :8000`
- Try: `pip install --upgrade pip` then reinstall requirements

### Frontend shows "Failed to fetch"
- Ensure backend is running at http://localhost:8000
- Check CORS settings in `main.py`
- Open browser console (F12) to see error details

### CORS Issues
The backend already has CORS enabled for `localhost:5173`. If you change the frontend port, update the CORS settings in `backend/main.py`.

---

## 📦 Tech Stack

**Backend:**
- FastAPI (async web framework)
- Uvicorn (ASGI server)
- NumPy (calculations)
- TextBlob (sentiment analysis)

**Frontend:**
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (data visualization)
- Lucide Icons

---

## 📝 Notes

- All mock data is randomly generated - perfect for testing
- The UI styling remains unchanged (Tailwind classes preserved)
- Auto-refresh intervals can be adjusted in each component
- Backend supports multiple concurrent requests

Enjoy building with HoloQuant! 🎉
