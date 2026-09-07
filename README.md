# UMKM Digital 🇮🇩

> Platform AI untuk generate gambar promosi produk makanan & minuman UMKM secara otomatis menggunakan Google Gemini AI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## ✨ Fitur

- 🤖 **AI Image Generator** — Generate gambar promosi dari foto produk menggunakan Gemini AI
- 📱 **WhatsApp Story** — Format 9:16, caption casual + emoji
- 📷 **Instagram Post** — Format 3:4, caption lifestyle + hashtag
- ⬇️ **Download & Regenerate** — Download gambar atau generate ulang jika kurang sesuai
- 💬 **Caption AI** — Caption otomatis berbeda per platform
- 👤 **Autentikasi** — Login & register dengan JWT
- 🔑 **Gemini API Key** — Setiap user pakai API key sendiri
- 🛡️ **Admin Panel** — User management, kotak masuk, pengaturan aplikasi

---

## 🚀 Quick Start (Lokal)

### 1. Clone repo
```bash
git clone https://github.com/username/umkm-digital.git
cd umkm-digital
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env
# Edit .env dan isi nilai Supabase
```

### 4. Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com)
2. Jalankan `supabase-setup.sql` di **SQL Editor**
3. Buat **Storage Bucket** bernama `assets` (set ke Public)
4. Copy `Project URL` dan `service_role` key ke `.env`

### 5. Jalankan server
```bash
npm start
```

Buka: **http://localhost:3000**
Admin: **http://localhost:3000/admin.html** (`admin` / `Polman@21`)

---

## ☁️ Deploy ke Vercel

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit: UMKM Digital"
git branch -M main
git remote add origin https://github.com/username/umkm-digital.git
git push -u origin main
```

### 2. Import ke Vercel
1. Login di [vercel.com](https://vercel.com)
2. **New Project** → Import dari GitHub
3. Pilih repo `umkm-digital`
4. **Environment Variables** — tambahkan:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
5. Klik **Deploy**

### 3. Auto-deploy
Setiap push ke branch `main` akan otomatis trigger deploy baru di Vercel! 🎉

---

## 🔑 Mendapatkan Gemini API Key

1. Buka [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Login dengan akun Google
3. Klik **Create API Key**
4. Copy dan paste di aplikasi

---

## 📁 Struktur Project

```
├── server.js              # Express backend (Supabase)
├── vercel.json            # Vercel deployment config
├── supabase-setup.sql     # SQL schema untuk Supabase
├── .env.example           # Template environment variables
├── public/
│   ├── index.html         # Main app (auth + dashboard)
│   ├── admin.html         # Admin panel
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   └── assets/            # Logo & favicon default
└── package.json
```

---

## 🛡️ Admin Panel

Akses: `/admin.html`
- Username: `admin`
- Password: `Polman@21`

Fitur admin:
- 📊 Dashboard statistik user & pesan
- 👥 User management (lihat & hapus user)
- 💌 Kotak masuk feedback dari user
- ⚙️ Ganti favicon & logo aplikasi

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Vanilla HTML + CSS + JavaScript |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Auth | JWT (jsonwebtoken) |
| AI | Google Gemini API |
| Hosting | Vercel |
| CI/CD | GitHub → Vercel |
