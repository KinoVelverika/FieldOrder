const jwt = require('jsonwebtoken');
const db = require('../config/database');

const adminController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);

      // Validate input
      if (!email || !password) {
        console.log('Login failed: Missing email or password');
        return res.status(400).json({ 
          success: false,
          message: 'Email dan password harus diisi' 
        });
      }

      // Find admin by email
      const [admins] = await db.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
      const admin = admins[0];

      if (!admin) {
        console.log('Login failed: Admin not found');
        return res.status(401).json({ 
          success: false,
          message: 'Email atau password salah' 
        });
      }

      // Compare password
      if (password !== admin.password) {
        console.log('Login failed: Invalid password');
        return res.status(401).json({ 
          success: false,
          message: 'Email atau password salah' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: admin.id,
          email: admin.email,
          role: admin.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('Login successful, token generated for admin:', admin.email);

      // Send response
      res.json({
        success: true,
        message: 'Login berhasil',
        token: token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Terjadi kesalahan saat login' 
      });
    }
  },

  logout: async (req, res) => {
    try {
      res.json({ message: 'Logout berhasil' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat logout' });
    }
  },

  getDashboard: async (req, res) => {
    try {
      // Get dashboard data
      const [todayBookings] = await db.query(
        'SELECT COUNT(*) as count FROM bookings WHERE DATE(booking_date) = CURDATE()'
      );
      
      const [pendingPayments] = await db.query(
        'SELECT COUNT(*) as count FROM bookings WHERE status = "pending"'
      );
      
      const [completedBookings] = await db.query(
        'SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"'
      );

      // Get recent activities (last 5 bookings)
      const [recentActivities] = await db.query(`
        SELECT b.*, u.name as user_name, f.name as field_name
        FROM bookings b 
        LEFT JOIN users u ON b.user_id = u.id 
        LEFT JOIN fields f ON b.field_id = f.id
        ORDER BY b.created_at DESC 
        LIMIT 5
      `);

      res.json({
        today_bookings: todayBookings[0]?.count || 0,
        pending_payments: pendingPayments[0]?.count || 0,
        completed_bookings: completedBookings[0]?.count || 0,
        recent_activities: recentActivities.map(booking => ({
          description: `Pemesanan baru dari ${booking.user_name || 'User'} untuk ${booking.field_name || 'Lapangan'} pada ${new Date(booking.booking_date).toLocaleDateString('id-ID')}`,
          created_at: booking.created_at
        }))
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data dashboard' });
    }
  },

  // Get field status for admin
  getFieldStatus: async (req, res) => {
    try {
      const { date } = req.query;
      
      // Validasi tanggal
      if (!date || isNaN(new Date(date).getTime())) {
        return res.status(400).json({ message: 'Tanggal tidak valid' });
      }

      // Query sesuai dengan struktur database yang ada
      const [schedules] = await db.query(`
        SELECT 
          id,
          field as name,
          date,
          time_slot,
          price,
          status,
          created_at,
          updated_at
        FROM schedules
        WHERE date = ?
        ORDER BY field, time_slot
      `, [date]);

      // Format data untuk response
      const result = schedules.map(schedule => ({
        id: schedule.id,
        name: schedule.name,
        day: new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long' }),
        timeSlot: schedule.time_slot,
        price: schedule.price,
        status: schedule.status === 'Available' ? 'tersedia' : 'maintenance'
      }));
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching field status:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat mengambil status lapangan' });
    }
  }
};

module.exports = adminController; 