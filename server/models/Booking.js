const pool = require('../config/database');

class Booking {
  static async create(bookingData) {
    const [result] = await pool.execute(
      `INSERT INTO bookings (user_id, field_id, schedule_id, booking_date, 
       start_time, end_time, total_price, status, payment_proof, booking_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingData.user_id,
        bookingData.field_id,
        bookingData.schedule_id,
        bookingData.booking_date,
        bookingData.start_time,
        bookingData.end_time,
        bookingData.total_price,
        'pending',
        bookingData.payment_proof || null,
        bookingData.booking_code
      ]
    );
    return result.insertId;
  }

  static async findByCode(bookingCode) {
    const [rows] = await pool.execute(
      `SELECT b.*, f.name as field_name, s.date as schedule_date 
       FROM bookings b
       JOIN fields f ON b.field_id = f.id
       JOIN schedules s ON b.schedule_id = s.id
       WHERE b.booking_code = ?`,
      [bookingCode]
    );
    return rows[0];
  }

  static async checkAvailability(fieldId, date, startTime, endTime) {
    const [rows] = await pool.execute(
      `SELECT id FROM bookings 
       WHERE field_id = ? AND booking_date = ? 
       AND ((start_time < ? AND end_time > ?) OR 
            (start_time >= ? AND start_time < ?))`,
      [fieldId, date, endTime, startTime, startTime, endTime]
    );
    return rows.length === 0;
  }
}

module.exports = Booking;