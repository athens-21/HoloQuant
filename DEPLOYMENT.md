# HoloQuant Deployment Guide

## 🚀 Deploy Frontend to GitHub Pages

### ขั้นตอนการ Deploy:

1. **Push ไปยัง GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HoloQuant Trading Dashboard"
   git branch -M main
   git remote add origin https://github.com/athens-21/HoloQuant.git
   git push -u origin main
   ```

2. **เปิดใช้งาน GitHub Pages**
   - ไปที่ GitHub repository settings
   - เลือก **Pages** จากเมนูด้านซ้าย
   - ใน **Source** เลือก **GitHub Actions**
   
3. **Deploy อัตโนมัติ**
   - ทุกครั้งที่ push ไปยัง `main` branch
   - GitHub Actions จะ build และ deploy อัตโนมัติ
   - เว็บจะเข้าถึงได้ที่: `https://athens-21.github.io/HoloQuant/`

### หมายเหตุ:
- Frontend จะทำงานได้เต็มที่เมื่อมี Backend API
- ให้แก้ไข `API_BASE_URL` ใน components เพื่อ point ไปที่ backend ที่ deploy แล้ว

---

## 🐍 Deploy Backend (FastAPI)

เนื่องจาก GitHub Pages รองรับเฉพาะ static files เท่านั้น Backend จะต้อง deploy แยกต่างหาก

### ตัวเลือกการ Deploy Backend:

### Option 1: **Render.com** (แนะนำ - ฟรี)

1. สร้างไฟล์ `requirements.txt` ใน folder `backend/`:
   ```txt
   fastapi==0.109.0
   uvicorn==0.27.0
   numpy
   textblob
   git+https://github.com/deepentropy/tvscreener.git
   ```

2. สร้างไฟล์ `render.yaml` ในโฟลเดอร์หลัก:
   ```yaml
   services:
     - type: web
       name: holoquant-api
       env: python
       buildCommand: "cd backend && pip install -r requirements.txt"
       startCommand: "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
       plan: free
   ```

3. ไปที่ [render.com](https://render.com)
   - สร้างบัญชีด้วย GitHub
   - เลือก **New** → **Web Service**
   - เชื่อมต่อ GitHub repository
   - Render จะ deploy อัตโนมัติ

4. หลัง deploy แล้ว คัดลอก URL (เช่น `https://holoquant-api.onrender.com`)

### Option 2: **Railway.app** (ใช้งานง่าย)

1. ไปที่ [railway.app](https://railway.app)
2. เลือก **Deploy from GitHub repo**
3. เลือก repository และ branch
4. ตั้งค่า:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy และรับ URL

### Option 3: **PythonAnywhere** (สำหรับ Python โดยเฉพาะ)

1. สร้างบัญชีที่ [pythonanywhere.com](https://www.pythonanywhere.com)
2. อัพโหลดโค้ดผ่าน GitHub หรือ upload files
3. ตั้งค่า Web app ด้วย manual configuration
4. ติดตั้ง dependencies และรัน

---

## 🔗 เชื่อมต่อ Frontend กับ Backend

หลังจาก deploy backend แล้ว ต้องแก้ไข frontend ให้เชื่อมต่อกับ backend URL

### แก้ไขไฟล์ที่ใช้ API:

1. **src/components/AssetExplorer.tsx**
   ```typescript
   const API_BASE_URL = "https://YOUR_BACKEND_URL.onrender.com";
   ```

2. **src/components/MarketIntelligence.tsx**
   ```typescript
   const API_BASE_URL = "https://YOUR_BACKEND_URL.onrender.com";
   ```

3. **src/components/QuantLogic.tsx**
   ```typescript
   const API_BASE_URL = "https://YOUR_BACKEND_URL.onrender.com";
   ```

### วิธีที่ดีกว่า - ใช้ Environment Variables:

สร้างไฟล์ `.env.production`:
```env
VITE_API_BASE_URL=https://YOUR_BACKEND_URL.onrender.com
```

แล้วใช้ใน components:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
```

---

## 📝 Checklist

- [ ] Push code ไปยัง GitHub
- [ ] เปิดใช้งาน GitHub Pages ใน repo settings
- [ ] Deploy backend ไปยังแพลตฟอร์มที่เลือก
- [ ] อัพเดท API_BASE_URL ใน frontend components
- [ ] Commit และ push การเปลี่ยนแปลง
- [ ] ตรวจสอบว่าเว็บทำงานได้ที่ GitHub Pages URL

---

## 🛠️ Local Development

```bash
# Frontend
npm install
npm run dev  # รันที่ http://localhost:8080

# Backend
cd backend
pip install -r requirements.txt
python main.py  # รันที่ http://localhost:8000
```

---

## 🆘 Troubleshooting

### ปัญหาที่อาจเจอ:

1. **404 Not Found หลัง refresh**
   - เพิ่มไฟล์ `public/404.html` ที่ redirect ไปยัง index.html
   - หรือใช้ Hash Router แทน Browser Router

2. **API CORS Error**
   - เพิ่ม CORS middleware ใน `backend/main.py`:
     ```python
     from fastapi.middleware.cors import CORSMiddleware
     
     app.add_middleware(
         CORSMiddleware,
         allow_origins=["*"],  # ใน production ควรระบุ origin ที่เฉพาะเจาะจง
         allow_credentials=True,
         allow_methods=["*"],
         allow_headers=["*"],
     )
     ```

3. **GitHub Actions Build Failed**
   - ตรวจสอบ logs ใน Actions tab
   - ตรวจสอบว่า `package.json` มี build script: `"build": "vite build"`

---

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)

---

**สร้างโดย:** HoloQuant Team  
**Updated:** February 2026
