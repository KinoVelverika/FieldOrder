const db = require('../config/database');

exports.getAvailableFields = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Validasi tanggal
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'Tanggal tidak valid' });
    }
    
    // Query untuk mendapatkan lapangan dan jadwal yang tersedia
    const [fields] = await db.query(`
      SELECT 
        f.id, f.name, f.description,
        fs.id AS schedule_id, fs.start_time, fs.end_time, fs.price,
        fs.status,
        CASE WHEN b.id IS NULL THEN 'available' ELSE 'booked' END AS availability
      FROM fields f
      JOIN field_schedules fs ON f.id = fs.field_id
      LEFT JOIN bookings b ON fs.id = b.schedule_id 
        AND b.booking_date = ? 
        AND b.status IN ('pending', 'paid', 'confirmed')
      WHERE f.status = 'available'
        AND fs.status = 'available'
        AND DAYOFWEEK(?) = 
          CASE fs.day
            WHEN 'Monday' THEN 2
            WHEN 'Tuesday' THEN 3
            WHEN 'Wednesday' THEN 4
            WHEN 'Thursday' THEN 5
            WHEN 'Friday' THEN 6
            WHEN 'Saturday' THEN 7
            WHEN 'Sunday' THEN 1
          END
      ORDER BY f.name, fs.start_time
    `, [date, date]);
    
    // Format data untuk response
    const result = fields.reduce((acc, field) => {
      const existingField = acc.find(f => f.id === field.id);
      const schedule = {
        id: field.schedule_id,
        start_time: field.start_time,
        end_time: field.end_time,
        price: field.price,
        status: field.availability
      };
      
      if (existingField) {
        existingField.schedules.push(schedule);
      } else {
        acc.push({
          id: field.id,
          name: field.name,
          description: field.description,
          schedules: [schedule]
        });
      }
      
      return acc;
    }, []);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching fields:', error);
    res.status(500).json({ message: 'Server error' });
  }
};