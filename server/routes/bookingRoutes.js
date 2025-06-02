const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

router.post('/', upload.single('payment_proof'), bookingController.createBooking);
router.get('/:code', bookingController.getBooking);

module.exports = router;