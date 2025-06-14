const Schedule = require('../models/schedule');

// Create new schedule
exports.createSchedule = async (req, res) => {
  try {
    const { field, date, time_slot, price, status } = req.body;

    // Validasi input
    if (!field || !date || !time_slot || !price || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    // Validasi tanggal (tidak boleh di masa lalu)
    const scheduleDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (scheduleDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tanggal tidak boleh di masa lalu' 
      });
    }

    // Validasi harga
    if (price <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Harga harus lebih dari 0' 
      });
    }

    const scheduleId = await Schedule.create({
      field,
      date,
      time_slot,
      price: parseInt(price),
      status
    });

    res.status(201).json({
      success: true,
      message: 'Jadwal berhasil ditambahkan',
      data: { id: scheduleId }
    });

  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat menambahkan jadwal'
    });
  }
};

// Get schedules for a field on a specific date
exports.getSchedules = async (req, res) => {
  try {
    const { field, date } = req.query;

    if (!field || !date) {
      return res.status(400).json({
        success: false,
        message: 'Field dan tanggal harus diisi'
      });
    }

    const schedules = await Schedule.getSchedules(field, date);
    
    res.json({
      success: true,
      data: schedules
    });

  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil jadwal'
    });
  }
};

// Get all fields
exports.getFields = async (req, res) => {
  try {
    const fields = await Schedule.getAllFields();
    res.json(fields);
  } catch (error) {
    console.error('Error fetching fields:', error);
    res.status(500).json({ error: 'Gagal mengambil data lapangan' });
  }
};

// Update schedule status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Available', 'maintenance'].includes(status)) {
      return res.status(400).json({ 
        error: 'Status harus berupa "Available" atau "maintenance"' 
      });
    }

    const success = await Schedule.updateStatus(id, status);
    if (!success) {
      return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    }

    res.json({ 
      success: true, 
      message: 'Status jadwal berhasil diperbarui' 
    });

  } catch (error) {
    console.error('Error updating schedule status:', error);
    res.status(500).json({ error: 'Gagal memperbarui status jadwal' });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Schedule.deleteSchedule(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Jadwal tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Jadwal berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus jadwal'
    });
  }
}; 