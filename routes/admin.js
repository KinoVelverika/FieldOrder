const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware untuk mengecek autentikasi admin
const checkAdminAuth = (req, res, next) => {
  // Cek token dari localStorage
  const token = req.headers.authorization || req.cookies.adminToken;
  if (!token) {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.redirect('/admin/login');
  }
  // TODO: Implementasi verifikasi token
  next();
};

// Route default untuk /admin - langsung ke dashboard
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/views/admin/dashboard.html'));
});

// Route untuk halaman login admin
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/views/admin/login.html'));
});

// Route untuk dashboard admin
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/views/admin/dashboard.html'));
});

// Route untuk halaman ubah jadwal
router.get('/ubahjadwal', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/views/admin/ubahjadwal.html'));
});

// Route untuk halaman status lapangan
router.get('/status', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/views/admin/status.html'));
});

// Route untuk halaman riwayat pemesanan
router.get('/riwayat', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/views/admin/riwayat.html'));
});

// Route untuk halaman verifikasi pembayaran
router.get('/verifikasi', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/views/admin/verifikasi.html'));
});

// Route untuk logout
router.get('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/login');
});

// API Routes
// Login API
router.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  // TODO: Implementasi validasi login
  // Sementara redirect ke dashboard
  const token = 'dummy-token';
  res.cookie('adminToken', token, { httpOnly: true });
  res.json({ token });
});

// Dashboard API
router.get('/api/admin/dashboard', checkAdminAuth, async (req, res) => {
  // TODO: Implementasi data dashboard
  res.json({
    today_bookings: 0,
    pending_payments: 0,
    completed_bookings: 0,
    recent_activities: []
  });
});

// Logout API
router.post('/api/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logged out successfully' });
});

// Handle 404 untuk route admin yang tidak ditemukan
router.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../Client/views/admin/404.html'));
});

module.exports = router; 