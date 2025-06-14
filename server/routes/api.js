// server/routes/api.js

const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { getAvailableSchedules } = require('../controllers/fieldController');

// Daftar lapangan tersedia - tanpa auth
router.get('/fields', (req, res) => fieldController.getAvailableFields(req, res));

// Route untuk mendapatkan jadwal yang tersedia
router.get('/schedules/available', getAvailableSchedules);

module.exports = router;