const Booking = require('../models/Booking');
const Field = require('../models/Field');
const { generateBookingCode } = require('../utils/helpers');

// Buat Booking
exports.createBooking = async (req, res) => {
  try {
    const { fieldId, date, startTime, endTime } = req.body;
    const userId = req.user.id;

    const isAvailable = await Booking.checkAvailability(fieldId, date, startTime, endTime);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Slot waktu sudah dipesan' });
    }

    const field = await Field.findById(fieldId);
    const duration = (new Date(`1970-01-01T${endTime}`) - new Date(`1970-01-01T${startTime}`)) / (1000 * 60 * 60);
    const totalPrice = field.price_per_hour * duration;

    const bookingData = {
      user_id: userId,
      field_id: fieldId,
      booking_date: date,
      start_time: startTime,
      end_time: endTime,
      total_price: totalPrice,
      booking_code: generateBookingCode(),
      status: 'pending'
    };

    const bookingId = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      bookingId,
      bookingCode: bookingData.booking_code,
      totalPrice
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Gagal membuat pemesanan' });
  }
};

// Ambil Booking berdasarkan booking_code
exports.getBooking = async (req, res) => {
  try {
    const code = req.params.code;
    const booking = await Booking.findByCode(code);
    if (!booking) {
      return res.status(404).json({ error: 'Booking tidak ditemukan' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error mengambil booking:', error);
    res.status(500).json({ error: 'Gagal mengambil data booking' });
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