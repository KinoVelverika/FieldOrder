const db = require('../config/database');

exports.getAvailableFields = async (req, res) => {
  try {
    const { date } = req.query;
    console.log('Fetching fields for date:', date);
    
    // Validasi tanggal
    if (!date || isNaN(new Date(date).getTime())) {
      console.log('Invalid date:', date);
      return res.status(400).json({ message: 'Tanggal tidak valid' });
    }

    // First, let's log the bookings for this date to see what we're dealing with
    const bookingsQuery = `
      SELECT field_name, booking_date, start_time, end_time, status 
      FROM bookings 
      WHERE booking_date = ? AND status != 'cancelled'
    `;
    const [bookings] = await db.query(bookingsQuery, [date]);
    console.log('Bookings for this date:', bookings);

    // Query untuk mendapatkan jadwal lapangan yang belum dibooking
    const query = `
      SELECT 
        s.id,
        s.field as name,
        s.time_slot,
        s.price,
        s.status,
        b.id as booking_id,
        b.start_time as booking_start,
        b.end_time as booking_end
      FROM schedules s
      LEFT JOIN bookings b ON 
        s.field = b.field_name AND 
        s.date = b.booking_date AND
        b.status NOT IN ('cancelled', 'pending') AND
        (
          -- Convert time_slot to TIME type for comparison
          TIME(SUBSTRING_INDEX(s.time_slot, '-', 1)) BETWEEN b.start_time AND b.end_time
          OR 
          TIME(SUBSTRING_INDEX(s.time_slot, '-', -1)) BETWEEN b.start_time AND b.end_time
          OR
          (
            b.start_time BETWEEN TIME(SUBSTRING_INDEX(s.time_slot, '-', 1)) AND TIME(SUBSTRING_INDEX(s.time_slot, '-', -1))
            AND
            b.end_time BETWEEN TIME(SUBSTRING_INDEX(s.time_slot, '-', 1)) AND TIME(SUBSTRING_INDEX(s.time_slot, '-', -1))
          )
        )
      WHERE s.date = ? 
        AND s.status = 'available'
      ORDER BY s.field, s.time_slot
    `;
    
    console.log('Executing query:', query, 'with date:', date);
    const [schedules] = await db.query(query, [date]);
    console.log('All schedules with booking info:', schedules);

    // Filter out the booked ones
    const availableSchedules = schedules.filter(schedule => !schedule.booking_id);
    
    // Remove the booking info from the response
    const cleanSchedules = availableSchedules.map(({ booking_id, booking_start, booking_end, ...schedule }) => schedule);
    
    res.json(cleanSchedules);
  } catch (error) {
    console.error('Error in getAvailableFields:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data lapangan' });
  }
};

exports.getAvailableSchedules = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Validasi tanggal
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'Tanggal tidak valid' });
    }

    // Query untuk mendapatkan jadwal yang tersedia
    const [schedules] = await db.query(`
      SELECT 
        id,
        field,
        date,
        time_slot,
        price,
        status
      FROM schedules 
      WHERE date = ? 
      AND status != 'booked'
      ORDER BY field, time_slot
    `, [date]);

    // Format data untuk response
    const result = schedules.reduce((acc, schedule) => {
      const existingField = acc.find(f => f.name === schedule.field);
      
      if (existingField) {
        existingField.schedules.push({
          id: schedule.id,
          time_slot: schedule.time_slot,
          price: schedule.price,
          status: schedule.status
        });
      } else {
        acc.push({
          name: schedule.field,
          schedules: [{
            id: schedule.id,
            time_slot: schedule.time_slot,
            price: schedule.price,
            status: schedule.status
          }]
        });
      }
      
      return acc;
    }, []);

    res.json(result);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data jadwal' });
  }
};