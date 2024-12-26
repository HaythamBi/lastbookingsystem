import { getDb } from '../config/database.js';

export async function getClinicHours(req, res) {
  try {
    const db = await getDb();
    const hours = await db.all(
      `SELECT date, is_open, open_time, close_time 
       FROM clinic_hours_by_date 
       ORDER BY date`
    );
    
    res.json({
      success: true,
      data: hours.reduce((acc, h) => ({
        ...acc,
        [h.date]: {
          isOpen: Boolean(h.is_open),
          openTime: h.open_time,
          closeTime: h.close_time
        }
      }), {})
    });
  } catch (error) {
    console.error('Error getting clinic hours:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get clinic hours'
    });
  }
}

export async function getMonthHours(req, res) {
  const { date } = req.params;
  
  try {
    const db = await getDb();
    const month = new Date(date).toISOString().slice(0, 7);
    
    // Insert default hours for the month if they don't exist
    await db.run(`
      INSERT OR IGNORE INTO clinic_hours_by_date (date, is_open, open_time, close_time)
      SELECT 
        date(?, '+' || (seq.i - 1) || ' days') as date,
        1 as is_open,
        '09:00' as open_time,
        '17:00' as close_time
      FROM (
        SELECT i FROM generate_series(1, 31) i
        WHERE i <= (
          SELECT strftime('%d', date(?, '+1 month', '-1 day'))
        )
      ) seq`,
      [month + '-01', month + '-01']
    );

    const hours = await db.all(
      `SELECT date, is_open, open_time, close_time 
       FROM clinic_hours_by_date 
       WHERE date LIKE ?||'%'
       ORDER BY date`,
      [month]
    );
    
    res.json({
      success: true,
      data: hours.reduce((acc, h) => ({
        ...acc,
        [h.date]: {
          isOpen: Boolean(h.is_open),
          openTime: h.open_time,
          closeTime: h.close_time
        }
      }), {})
    });
  } catch (error) {
    console.error('Error getting month hours:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get month hours'
    });
  }
}

export async function updateClinicHours(req, res) {
  const { date } = req.params;
  const { isOpen, openTime, closeTime } = req.body;

  try {
    const db = await getDb();
    
    // Validate time format
    if (openTime && !openTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      throw new Error('Invalid open time format');
    }
    if (closeTime && !closeTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      throw new Error('Invalid close time format');
    }

    // Update or insert hours
    await db.run(`
      INSERT INTO clinic_hours_by_date (date, is_open, open_time, close_time)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        is_open = COALESCE(excluded.is_open, is_open),
        open_time = COALESCE(excluded.open_time, open_time),
        close_time = COALESCE(excluded.close_time, close_time),
        updated_at = CURRENT_TIMESTAMP`,
      [
        date,
        isOpen === undefined ? 1 : isOpen ? 1 : 0,
        openTime || '09:00',
        closeTime || '17:00'
      ]
    );

    // Get updated record
    const updatedHours = await db.get(
      `SELECT date, is_open, open_time, close_time 
       FROM clinic_hours_by_date 
       WHERE date = ?`,
      [date]
    );

    res.json({
      success: true,
      data: {
        date: updatedHours.date,
        isOpen: Boolean(updatedHours.is_open),
        openTime: updatedHours.open_time,
        closeTime: updatedHours.close_time
      },
      message: 'Clinic hours updated successfully'
    });
  } catch (error) {
    console.error('Error updating clinic hours:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update clinic hours'
    });
  }
}