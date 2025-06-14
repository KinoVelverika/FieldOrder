const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/adminController');

// Public routes (no auth required)
router.post('/api/login', adminController.login);
router.post('/api/logout', adminController.logout);
router.get('/api/field-status', adminController.getFieldStatus);

// Admin pages - no auth required
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Client/views/admin/login.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Client/views/admin/dashboard.html'));
});

router.get('/ubahjadwal', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Client/views/admin/ubahjadwal.html'));
});

router.get('/status', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Client/views/admin/status.html'));
});

router.get('/riwayat', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Client/views/admin/riwayat.html'));
});

router.get('/verifikasi', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Client/views/admin/verifikasi.html'));
});

// API routes - no auth required
router.get('/api/dashboard', adminController.getDashboard);

// Get all bookings for admin
router.get('/api/bookings', async (req, res) => {
  try {
    const db = require('../config/database');
    const [bookings] = await db.query(`
      SELECT 
        b.*,
        DATE_FORMAT(b.booking_date, '%Y-%m-%d') as booking_date
      FROM bookings b
      ORDER BY b.created_at DESC
    `);
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Gagal mengambil data booking' });
  }
});

// Get single booking details
router.get('/api/bookings/:bookingCode', async (req, res) => {
  try {
    const db = require('../config/database');
    const { bookingCode } = req.params;
    
    const [bookings] = await db.query(`
      SELECT 
        b.*,
        DATE_FORMAT(b.booking_date, '%Y-%m-%d') as booking_date
      FROM bookings b
      WHERE b.booking_code = ?
    `, [bookingCode]);
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }
    
    res.json({ data: bookings[0] });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Gagal mengambil detail booking' });
  }
});

// Update booking status
router.post('/api/bookings/:bookingCode/verify', async (req, res) => {
  try {
    const db = require('../config/database');
    const { bookingCode } = req.params;
    const { status } = req.body;
    
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }
    
    const [result] = await db.query(`
      UPDATE bookings 
      SET status = ?
      WHERE booking_code = ?
    `, [status, bookingCode]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }
    
    res.json({ message: 'Status booking berhasil diperbarui' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Gagal memperbarui status booking' });
  }
});

// Get dashboard statistics
router.get('/api/dashboard/stats', async (req, res) => {
  try {
    const db = require('../config/database');
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Get total bookings for today
    const [todayBookings] = await db.query(`
      SELECT COUNT(*) as total
      FROM bookings
      WHERE booking_date = ?
    `, [today]);

    // Get pending bookings for today
    const [pendingBookings] = await db.query(`
      SELECT COUNT(*) as total
      FROM bookings
      WHERE booking_date = ? AND status = 'pending'
    `, [today]);

    // Get verified bookings for today
    const [verifiedBookings] = await db.query(`
      SELECT COUNT(*) as total
      FROM bookings
      WHERE booking_date = ? AND status = 'verified'
    `, [today]);

    // Get recent activities (last 5 bookings)
    const [recentActivities] = await db.query(`
      SELECT 
        booking_code,
        field_name,
        booking_date,
        time_slot,
        customer_name,
        status,
        created_at
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      today_total: todayBookings[0].total,
      pending_total: pendingBookings[0].total,
      verified_total: verifiedBookings[0].total,
      recent_activities: recentActivities
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Gagal mengambil statistik dashboard' });
  }
});

module.exports = router; 