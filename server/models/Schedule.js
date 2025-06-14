const db = require('../config/database');

class Schedule {
  static async create(scheduleData) {
    try {
      const { field, date, time_slot, price, status } = scheduleData;
      
      // Check if schedule already exists
      const [existing] = await db.query(
        'SELECT id FROM schedules WHERE field = ? AND date = ? AND time_slot = ?',
        [field, date, time_slot]
      );

      if (existing.length > 0) {
        throw new Error('Jadwal sudah ada untuk waktu tersebut');
      }

      // Insert new schedule
      const [result] = await db.query(
        'INSERT INTO schedules (field, date, time_slot, price, status) VALUES (?, ?, ?, ?, ?)',
        [field, date, time_slot, price, status]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getSchedules(field, date) {
    try {
      const [schedules] = await db.query(
        `SELECT * FROM schedules 
         WHERE field = ? AND date = ?
         ORDER BY time_slot`,
        [field, date]
      );
      return schedules;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSchedule(scheduleId) {
    try {
      const [result] = await db.query(
        'DELETE FROM schedules WHERE id = ?',
        [scheduleId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Schedule;
