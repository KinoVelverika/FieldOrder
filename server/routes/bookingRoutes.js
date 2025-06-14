const express = require('express');
const router = express.Router();
const { createBooking, getBooking } = require('../controllers/bookingController');
const upload = require('../utils/fileUpload');

// Route untuk membuat booking baru dengan upload file
router.post('/', upload.single('payment_proof'), createBooking);

// Route untuk mendapatkan detail booking berdasarkan kode
router.get('/:code', getBooking);

module.exports = router;