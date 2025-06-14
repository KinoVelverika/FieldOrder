const Booking = require('../models/Booking');
const Field = require('../models/Field');
const { generateBookingCode } = require('../utils/helpers');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');

// Buat Booking
const createBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      field_name,
      booking_date,
      start_time,
      end_time,
      total_price,
      customer_name,
      customer_email,
      customer_phone,
      schedule_id
    } = req.body;

    // Validasi schedule_id
    if (!schedule_id) {
      throw new Error('Schedule ID tidak valid');
    }

    // Cek status schedule sebelum booking
    const [schedules] = await connection.query(
      'SELECT status FROM schedules WHERE id = ? FOR UPDATE',
      [schedule_id]
    );

    if (schedules.length === 0) {
      throw new Error('Jadwal tidak ditemukan');
    }

    if (schedules[0].status === 'booked') {
      throw new Error('Jadwal sudah dibooking');
    }

    // Generate unique booking code
    const booking_code = 'BK' + uuidv4().substring(0, 8).toUpperCase();
    
    // Get the payment proof path from the uploaded file
    const payment_proof_path = req.file ? `/uploads/payment_proofs/${req.file.filename}` : null;

    // Format time slot
    const time_slot = `${start_time}-${end_time}`;

    // Insert booking into database
    const bookingQuery = `
      INSERT INTO bookings (
        schedule_id,
        field_name,
        booking_date,
        time_slot,
        total_price,
        customer_name,
        customer_email,
        customer_phone,
        payment_proof_path,
        booking_code,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const bookingValues = [
      schedule_id,
      field_name,
      booking_date,
      time_slot,
      total_price,
      customer_name,
      customer_email,
      customer_phone,
      payment_proof_path,
      booking_code
    ];

    const [bookingResult] = await connection.query(bookingQuery, bookingValues);

    // Update schedule status to booked
    const scheduleQuery = `
      UPDATE schedules 
      SET status = 'booked'
      WHERE id = ?
    `;

    await connection.query(scheduleQuery, [schedule_id]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking_code: booking_code
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Ambil Booking berdasarkan booking_code
const getBooking = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Query untuk mendapatkan detail booking beserta schedule
    const query = `
      SELECT 
        b.*,
        s.time_slot,
        DATE_FORMAT(b.booking_date, '%Y-%m-%d') as booking_date,
        TIME_FORMAT(SUBSTRING_INDEX(s.time_slot, '-', 1), '%H:%i') as start_time,
        TIME_FORMAT(SUBSTRING_INDEX(s.time_slot, '-', -1), '%H:%i') as end_time
      FROM bookings b
      LEFT JOIN schedules s ON b.schedule_id = s.id
      WHERE b.booking_code = ?
    `;
    
    const [bookings] = await db.query(query, [code]);
    
    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking tidak ditemukan' 
      });
    }

    // Format data untuk response
    const booking = bookings[0];
    const formattedBooking = {
      booking_code: booking.booking_code,
      field_name: booking.field_name,
      booking_date: booking.booking_date,
      start_time: booking.start_time,
      end_time: booking.end_time,
      total_price: booking.total_price,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      status: booking.status,
      payment_proof_path: booking.payment_proof_path,
      created_at: booking.created_at
    };

    res.json({
      success: true,
      data: formattedBooking
    });
  } catch (error) {
    console.error('Error mengambil booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mengambil data booking',
      error: error.message 
    });
  }
};

// Opsional: Ambil semua booking
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (error) {
    console.error('Error mengambil data booking:', error);
    res.status(500).json({ error: 'Gagal mengambil data booking' });
  }
};

// Export all functions
module.exports = {
  createBooking,
  getBooking
};