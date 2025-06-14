const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Schedule routes - tanpa auth
router.post('/', scheduleController.createSchedule);
router.get('/', scheduleController.getSchedules);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;