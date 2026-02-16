# HoloQuant Backend

FastAPI backend for the HoloQuant trading dashboard.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

API documentation: http://localhost:8000/docs

## API Endpoints

- `GET /api/assets/{category}` - Get assets by category (stocks, crypto, forex, all)
- `GET /api/analyze/{symbol}` - Analyze a symbol and get consensus score
- `GET /api/news/{symbol}` - Get news for a symbol with sentiment analysis

## Future Enhancements

- Integrate tvscreener for real market data
- Add caching layer (Redis)
- Implement real-time WebSocket updates
- Add authentication
