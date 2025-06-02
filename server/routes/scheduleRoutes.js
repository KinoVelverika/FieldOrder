const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule'); // Model database

// Ambil jadwal semua lapangan
router.get('/api/jadwal', async (req, res) => {
  try {
    const jadwal = {
      lapangan_a: await Schedule.find({ lapangan: 'A' }),
      lapangan_b: await Schedule.find({ lapangan: 'B' }),
      lapangan_c: await Schedule.find({ lapangan: 'C' })
    };
    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;