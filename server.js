const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'umkm-digital-secret-key-2024-fallback';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Polman@21';

// ─── Supabase Client ──────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const subaseConfigured = !!(supabaseUrl && supabaseServiceKey);

if (!subaseConfigured) {
  console.warn('\n⚠️  ========================================');
  console.warn('⚠️  SUPABASE belum dikonfigurasi!');
  console.warn('⚠️  Isi .env dengan SUPABASE_URL dan');
  console.warn('⚠️  SUPABASE_SERVICE_KEY dari dashboard Supabase');
  console.warn('⚠️  ========================================\n');
}

// Buat dummy supabase client jika env belum diisi
const supabase = subaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

// Middleware: tolak request API jika Supabase belum dikonfigurasi
const requireSupabase = (req, res, next) => {
  if (!supabase) {
    return res.status(503).json({
      error: 'Database belum dikonfigurasi. Isi SUPABASE_URL dan SUPABASE_SERVICE_KEY di file .env'
    });
  }
  next();
};

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Multer — Memory storage (untuk upload ke Supabase Storage) ────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|ico|svg/;
    const ok = allowed.test(file.mimetype) || allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
    cb(null, ok);
  }
});

// ─── Auth Middleware ───────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ─── Helper: Upload file ke Supabase Storage ───────────────────────────────────
async function uploadToSupabaseStorage(buffer, filename, mimeType, bucket = 'assets') {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`public/${filename}`, buffer, {
      contentType: mimeType,
      upsert: true
    });

  if (error) throw new Error('Upload gagal: ' + error.message);

  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(`public/${filename}`);

  return publicData.publicUrl;
}

// ─── Auth Routes ───────────────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', requireSupabase, async (req, res) => {
  try {
    const { name, email, password, gemini_api_key } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
    }

    // Check existing email
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) return res.status(400).json({ error: 'Email sudah terdaftar' });

    const hashed = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('users')
      .insert({ name, email, password: hashed, gemini_api_key: gemini_api_key || null })
      .select('id, name, email, gemini_api_key')
      .single();

    if (error) throw error;

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Login
app.post('/api/auth/login', requireSupabase, async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) return res.status(400).json({ error: 'Email atau password salah' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Email atau password salah' });

    // Update last_login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, gemini_api_key: user.gemini_api_key }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, requireSupabase, async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, gemini_api_key, created_at, last_login')
    .eq('id', req.user.id)
    .single();

  if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
  res.json({ user });
});

// ─── User Routes ───────────────────────────────────────────────────────────────

// Update API Key
app.put('/api/user/apikey', authMiddleware, async (req, res) => {
  const { gemini_api_key } = req.body;
  if (!gemini_api_key) return res.status(400).json({ error: 'API Key wajib diisi' });

  if (supabase) {
    const { error } = await supabase
      .from('users')
      .update({ gemini_api_key })
      .eq('id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
  }

  res.json({ success: true, message: 'API Key berhasil diperbarui', gemini_api_key });
});

// Get user profile
app.get('/api/user/profile', authMiddleware, requireSupabase, async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, gemini_api_key, created_at')
    .eq('id', req.user.id)
    .single();

  res.json({ user });
});

// ─── Messages Routes ───────────────────────────────────────────────────────────
app.post('/api/messages', authMiddleware, requireSupabase, async (req, res) => {
  const { subject, message } = req.body;
  if (!message) return res.status(400).json({ error: 'Pesan wajib diisi' });

  const { data: user } = await supabase
    .from('users')
    .select('name, email')
    .eq('id', req.user.id)
    .single();

  const { error } = await supabase.from('messages').insert({
    user_id: req.user.id,
    user_name: user.name,
    user_email: user.email,
    subject: subject || 'Saran & Masukan',
    message
  });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, message: 'Pesan berhasil dikirim' });
});

// ─── Admin Routes ──────────────────────────────────────────────────────────────

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(400).json({ error: 'Username atau password admin salah' });
  }
  const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// Get all users
app.get('/api/admin/users', adminMiddleware, requireSupabase, async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, created_at, last_login, gemini_api_key')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // Map to add has_api_key field
  const mapped = users.map(u => ({
    ...u,
    has_api_key: !!u.gemini_api_key,
    gemini_api_key: undefined // don't expose key
  }));

  res.json({ users: mapped });
});

// Get all messages
app.get('/api/admin/messages', adminMiddleware, requireSupabase, async (req, res) => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ messages });
});

// Mark message as read
app.put('/api/admin/messages/:id/read', adminMiddleware, requireSupabase, async (req, res) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Delete message
app.delete('/api/admin/messages/:id', adminMiddleware, requireSupabase, async (req, res) => {
  const { error } = await supabase.from('messages').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Get settings — returns default values if Supabase not configured
app.get('/api/admin/settings', async (req, res) => {
  if (!supabase) {
    // Return default settings when DB not configured (dev mode)
    return res.json({
      settings: {
        favicon_url: '/assets/favicon.jpg',
        logo_url: '/assets/logo.jpg',
        app_name: 'UMKM Digital'
      }
    });
  }

  const { data, error } = await supabase.from('app_settings').select('*');
  if (error) return res.status(500).json({ error: error.message });

  const settings = {};
  (data || []).forEach(s => (settings[s.key] = s.value));
  res.json({ settings });
});

// Update settings (favicon/logo) — upload ke Supabase Storage
app.post('/api/admin/settings', adminMiddleware,
  upload.fields([{ name: 'favicon', maxCount: 1 }, { name: 'logo', maxCount: 1 }]),
  async (req, res) => {
    try {
      const updates = [];

      // Upload favicon ke Supabase Storage
      if (req.files?.favicon) {
        const file = req.files.favicon[0];
        const filename = `favicon-${Date.now()}${path.extname(file.originalname)}`;
        const url = await uploadToSupabaseStorage(file.buffer, filename, file.mimetype);
        updates.push({ key: 'favicon_url', value: url, updated_at: new Date().toISOString() });
      }

      // Upload logo ke Supabase Storage
      if (req.files?.logo) {
        const file = req.files.logo[0];
        const filename = `logo-${Date.now()}${path.extname(file.originalname)}`;
        const url = await uploadToSupabaseStorage(file.buffer, filename, file.mimetype);
        updates.push({ key: 'logo_url', value: url, updated_at: new Date().toISOString() });
      }

      // Update app name
      if (req.body.app_name) {
        updates.push({ key: 'app_name', value: req.body.app_name, updated_at: new Date().toISOString() });
      }

      // Upsert all setting changes
      if (updates.length > 0) {
        const { error } = await supabase.from('app_settings').upsert(updates, { onConflict: 'key' });
        if (error) throw error;
      }

      // Return updated settings
      const { data } = await supabase.from('app_settings').select('*');
      const settings = {};
      (data || []).forEach(s => (settings[s.key] = s.value));

      res.json({ success: true, settings });
    } catch (err) {
      console.error('Settings error:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete user
app.delete('/api/admin/users/:id', adminMiddleware, requireSupabase, async (req, res) => {
  const { error } = await supabase.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Stats
app.get('/api/admin/stats', adminMiddleware, requireSupabase, async (req, res) => {
  try {
    const [
      { count: totalUsers },
      { count: totalMessages },
      { count: unreadMessages }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
    ]);

    // Active users: login dalam 7 hari terakhir
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', sevenDaysAgo);

    res.json({
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalMessages: totalMessages || 0,
      unreadMessages: unreadMessages || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Catch-all: serve index.html ───────────────────────────────────────────────
app.get('{*path}', (req, res) => {
  if (req.path.startsWith('/api/') || req.path === '/admin.html') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start Server ───────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ UMKM Digital Server running at http://localhost:${PORT}`);
    console.log(`📱 Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`🔗 Supabase: ${supabaseUrl ? supabaseUrl : '❌ BELUM DIKONFIGURASI'}`);
  });
}

module.exports = app;
