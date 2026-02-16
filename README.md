# � HoloQuant

**Real-time Trading Dashboard** with Advanced Technical Analysis

A modern full-stack trading analytics platform featuring live market data, technical indicators, and intelligent insights for stocks, crypto, and forex markets.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python)

---

## ✨ Features

- 🔴 **Real-time Market Data** - Live pricing from 60+ assets across stocks, crypto, and forex
- 📈 **Technical Analysis** - 10+ indicators (RSI, MACD, Stochastic, Williams %R, ADX, CCI, etc.)
- 🎯 **Consensus Scoring** - AI-powered signal aggregation from multiple models
- 🔍 **Smart Search & Filter** - Find assets instantly with intelligent search
- 📱 **Responsive Design** - Beautiful UI built with shadcn/ui & Tailwind CSS
- ⚡ **High Performance** - Optimized with pagination and real-time updates

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.13+

### Installation & Run

```bash
# Clone and install
git clone https://github.com/athens-21/HoloQuant.git
cd HoloQuant
npm install

# Start Backend (Terminal 1)
cd backend
pip install -r requirements.txt
python main.py

# Start Frontend (Terminal 2)
npm run dev

# Open http://localhost:8080/dashboard
```

---

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts  
**Backend:** FastAPI, Python 3.13, Pandas, NumPy  
**Data Source:** tvscreener (TradingView API)

---

## 📊 API Endpoints

```
GET /api/assets/{category}     # Stocks, Crypto, Forex assets
GET /api/analyze/{symbol}      # Technical analysis
GET /api/news/{symbol}         # Market intelligence
```

---

## 👨‍💻 Author

**athens-21** - [GitHub](https://github.com/athens-21)

---

## 🌟 Acknowledgments

Built with ❤️ using [tvscreener](https://github.com/deepentropy/tvscreener) and [shadcn/ui](https://ui.shadcn.com)

---

**⭐ Star this repo if you find it useful!**
