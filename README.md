# 🚀 HoloQuant - Advanced Trading Dashboard

เว็บแอปพลิเคชันสำหรับวิเคราะห์ตลาดการเงิน พร้อมข้อมูลแบบ Real-time จาก Live Markets

## ✨ Features

- 📊 **Asset Explorer** - สำรวจหุ้น, คริปโต, และ Forex พร้อม Search และ Pagination
- 🎯 **Quant Logic** - วิเคราะห์ทางเทคนิคด้วย 10+ Oscillators และ Consensus Score
- 📰 **Market Intelligence** - ข่าวสารและ Sentiment Analysis แบบ Real-time
- 🔄 **Live Data** - ข้อมูลจริงจาก TradingView Screener API
- 🎨 **Modern UI** - สวยงามด้วย React + shadcn/ui + Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool แบบ Lightning fast
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components
- **Recharts** - Data visualization library

### Backend
- **FastAPI** - Modern Python web framework
- **tvscreener** - Real-time market data from TradingView
- **NumPy & Pandas** - Data processing
- **Uvicorn** - ASGI server

## 📦 Installation

### Prerequisites
- Node.js 18+ และ npm
- Python 3.11+
- Git

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/HoloQuant.git
cd HoloQuant

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend จะรันที่: `http://localhost:8080`

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (แนะนำ)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python main.py
```

Backend API จะรันที่: `http://localhost:8000`

## 🚀 Deployment

ดูคู่มือการ Deploy ฉบับเต็มที่: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deploy to GitHub Pages

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/HoloQuant.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - ไปที่ Repository Settings → Pages
   - เลือก Source: **GitHub Actions**

3. **Deploy Backend**
   - Deploy backend ไปที่ [Render.com](https://render.com) หรือ [Railway.app](https://railway.app)
   - อัพเดท `VITE_API_BASE_URL` ใน `.env.production`

4. **Push and Deploy**
   ```bash
   git add .
   git commit -m "Update API URL"
   git push
   ```

เว็บจะพร้อมใช้งานที่: `https://YOUR_USERNAME.github.io/HoloQuant/`

## 📁 Project Structure

```
HoloQuant/
├── src/
│   ├── components/
│   │   ├── AssetExplorer.tsx      # รายการ assets พร้อม search/pagination
│   │   ├── QuantLogic.tsx         # การวิเคราะห์ทางเทคนิค
│   │   ├── MarketIntelligence.tsx # ข่าวสารและ sentiment
│   │   └── ui/                    # shadcn/ui components
│   ├── pages/
│   │   ├── Dashboard.tsx          # หน้าแดชบอร์ดหลัก
│   │   └── Landing.tsx            # หน้า Landing page
│   └── lib/
│       └── utils.ts               # Utility functions
├── backend/
│   ├── main.py                    # FastAPI application
│   └── requirements.txt           # Python dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions workflow
├── public/
│   └── 404.html                   # SPA routing support
├── DEPLOYMENT.md                  # คู่มือการ Deploy
└── README.md                      # ไฟล์นี้
```

## 🔧 Configuration

### Environment Variables

สร้างไฟล์ `.env.local` สำหรับ development:

```env
VITE_API_BASE_URL=http://localhost:8000
```

สร้างไฟล์ `.env.production` สำหรับ production:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## 📊 API Endpoints

### Assets
- `GET /api/assets/{category}` - ดึงข้อมูล assets (stocks/crypto/forex/all)
- `GET /api/analyze/{symbol}` - วิเคราะห์สัญญาณเฉพาะ symbol

### Market Intelligence
- `GET /api/news/{symbol}` - ดึงข่าวสารและ sentiment

### Health Check
- `GET /` - ตรวจสอบสถานะ API

## 🔥 Features Detail

### Asset Explorer
- แสดงสินทรัพย์ 60+ รายการ (20 Stocks + 20 Crypto + 20 Forex)
- Search แบบ Real-time
- Pagination (5 items per page)
- เรียงตามปริมาณการซื้อขาย (Volume)
- คลิกเพื่อดูรายละเอียด

### Quant Logic
- **Consensus Score** - คะแนนรวมจาก 4 โมเดล (0-100)
- **10 Oscillators** - RSI, MACD, Stochastic, Williams %R, ADX, Momentum, CCI, Awesome Oscillator, Ultimate Oscillator
- **Signal Classification** - ซื้อ/ขาย/เป็นกลาง พร้อม color-coding
- **Radar Chart** - แสดงผลภาพรวมทางเทคนิค

### Market Intelligence
- ข่าวสารจากหลายแหล่ง
- Sentiment Analysis (Positive/Negative/Neutral)
- Average Sentiment Score
- อัพเดททุก 30 วินาที

## 🤝 Contributing

Pull requests are welcome! สำหรับการเปลี่ยนแปลงใหญ่ กรุณาเปิด issue เพื่อหารือก่อน

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

หากพบปัญหาหรือมีคำถาม:
1. เปิด [GitHub Issue](https://github.com/YOUR_USERNAME/HoloQuant/issues)
2. ตรวจสอบ [DEPLOYMENT.md](./DEPLOYMENT.md) สำหรับปัญหาที่พบบ่อย

## 🙏 Acknowledgments

- [TradingView](https://www.tradingview.com) - Market data
- [tvscreener](https://github.com/deepentropy/tvscreener) - Python API wrapper
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Vite](https://vitejs.dev) - Build tool

---

**Built with ❤️ by HoloQuant Team**  
**Last Updated:** February 2026
