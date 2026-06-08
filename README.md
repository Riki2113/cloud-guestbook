# 📋 Cloud Guestbook

Aplikasi guestbook berbasis cloud — Tugas Akhir Mata Kuliah Cloud Computing.

## 🏗️ Arsitektur & Stack

```
Developer → Git Push → GitHub → GitHub Actions CI/CD
                                      ↓
                               Build & Test
                                      ↓
                              Docker Container
                                      ↓
                          Railway.app (VPS Cloud)
                          ┌─────────────────────┐
                          │  Nginx (reverse proxy)│
                          │  Node.js/Express API  │
                          │  PostgreSQL Database  │
                          └─────────────────────┘
                                      ↓
                          https://xxx.railway.app
```

## 🚀 Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Container | Docker (multi-stage build) |
| CI/CD | GitHub Actions |
| Cloud Platform | Railway.app |

## 📁 Struktur Proyek

```
guestbook/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline
├── public/
│   └── index.html          # Frontend (HTML/CSS/JS)
├── src/
│   └── index.js            # Backend (Express API)
├── .env.example            # Template variabel lingkungan
├── .gitignore
├── Dockerfile              # Konfigurasi container
├── package.json
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/messages` | Ambil semua pesan |
| POST | `/api/messages` | Kirim pesan baru |
| DELETE | `/api/messages/:id` | Hapus pesan |
| GET | `/api/health` | Health check server |

## ⚙️ Setup Lokal

### Prasyarat
- Node.js 18+
- PostgreSQL
- Docker (opsional)

### Langkah 1: Clone & install

```bash
git clone https://github.com/USERNAME/cloud-guestbook.git
cd cloud-guestbook
npm install
```

### Langkah 2: Konfigurasi environment

```bash
cp .env.example .env
# Edit .env sesuai konfigurasi PostgreSQL lokal kamu
```

### Langkah 3: Jalankan

```bash
npm run dev     # Development (dengan nodemon)
npm start       # Production
```

Buka: http://localhost:3000

### Dengan Docker

```bash
docker build -t cloud-guestbook .
docker run -p 3000:3000 -e DATABASE_URL=postgresql://... cloud-guestbook
```

## ☁️ Deploy ke Railway

### Langkah 1: Buat akun Railway
- Daftar di https://railway.app (gratis, $5 credit)

### Langkah 2: Buat project baru
```
New Project → Deploy from GitHub Repo → Pilih repositori ini
```

### Langkah 3: Tambah PostgreSQL
```
New → Database → Add PostgreSQL
```

### Langkah 4: Set variabel environment
```
DATABASE_URL  → (otomatis dari Railway PostgreSQL)
NODE_ENV      → production
```

### Langkah 5: Set Railway Token untuk CI/CD
```
Dashboard Railway → Account → Tokens → New Token
GitHub Repo → Settings → Secrets → New secret: RAILWAY_TOKEN
```

## 📊 Fitur Aplikasi

- ✅ Kirim pesan dengan nama, email (opsional), dan teks
- ✅ Tampilkan semua pesan dengan avatar & timestamp relatif
- ✅ Hapus pesan
- ✅ Statistik: total pesan, pesan hari ini, uptime server
- ✅ Auto-refresh setiap 30 detik
- ✅ Responsive design (mobile-friendly)
- ✅ Health check endpoint untuk monitoring

## 🔒 Keamanan

- Input validation di backend (panjang maks, wajib isi)
- Parameterized queries (mencegah SQL injection)
- CORS dikonfigurasi
- Container berjalan sebagai non-root user
- SSL/HTTPS otomatis dari Railway

---

*Dibuat untuk Tugas Akhir Mata Kuliah Cloud Computing*
