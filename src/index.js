require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ── Koneksi Database PostgreSQL ─────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

// ── Inisialisasi Tabel ──────────────────────────────────────
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id        SERIAL PRIMARY KEY,
        name      VARCHAR(100)  NOT NULL,
        email     VARCHAR(150),
        message   TEXT          NOT NULL,
        created_at TIMESTAMPTZ  DEFAULT NOW()
      );
    `);
    console.log('✅ Database siap');
  } catch (err) {
    console.error('❌ Gagal inisialisasi database:', err.message);
    process.exit(1);
  }
}

// ── Routes API ──────────────────────────────────────────────

// GET /api/messages — ambil semua pesan (terbaru duluan)
app.get('/api/messages', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Gagal mengambil data' });
  }
});

// POST /api/messages — tambah pesan baru
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ success: false, error: 'Nama dan pesan wajib diisi' });
  }
  if (name.length > 100 || message.length > 1000) {
    return res.status(400).json({ success: false, error: 'Input terlalu panjang' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), email?.trim() || null, message.trim()]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Gagal menyimpan pesan' });
  }
});

// DELETE /api/messages/:id — hapus pesan
app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ success: true, message: 'Pesan dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Gagal menghapus pesan' });
  }
});

// GET /api/health — health check untuk monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Fallback: semua route lain → index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Start Server ────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
