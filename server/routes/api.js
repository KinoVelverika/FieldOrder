// server/routes/api.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const fieldController = require('../controllers/fieldController');

// Daftar lapangan tersedia
router.get('/fields', fieldController.getAvailableFields);

// Buat pemesanan baru
router.post('/bookings', bookingController.createBooking);

// Cek status pemesanan
router.get('/bookings/:code', bookingController.getBookingByCode);

module.exports = router;