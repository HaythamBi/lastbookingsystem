import { getDb } from '../config/database.js';

export async function getDashboardStats(req, res) {
  try {
    const db = await getDb();
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const [totalBookings, todayBookings, activeWorkers] = await Promise.all([
      db.get(
        `SELECT COUNT(*) as count FROM bookings 
         WHERE status = 'confirmed'`
      ),
      db.get(
        `SELECT COUNT(*) as count FROM bookings 
         WHERE status = 'confirmed' 
         AND date(start_time) = ?`,
        [today]
      ),
      db.get(
        `SELECT COUNT(*) as count FROM users 
         WHERE role = 'worker'`
      )
    ]);

    res.json({
      success: true,
      data: {
        totalBookings: totalBookings.count,
        todayBookings: todayBookings.count,
        activeWorkers: activeWorkers.count
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
}

export async function getBookings(req, res) {
  const { status, date } = req.query;
  
  try {
    const db = await getDb();
    let query = `
      SELECT b.*, 
             c.name as customer_name, 
             c.phone_number,
             w.name as worker_name
      FROM bookings b
      LEFT JOIN users c ON b.customer_id = c.id
      LEFT JOIN users w ON b.worker_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND date(b.start_time) = date(?)';
      params.push(date);
    }

    query += ' ORDER BY b.start_time DESC';
    
    const bookings = await db.all(query, params);
    
    res.json({
      success: true,
      data: bookings.map(booking => ({
        ...booking,
        startTime: booking.start_time,
        endTime: booking.end_time,
        customerName: booking.customer_name,
        workerName: booking.worker_name,
        phoneNumber: booking.phone_number
      }))
    });
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings'
    });
  }
}

export async function getWorkers(req, res) {
  try {
    const db = await getDb();
    const workers = await db.all(
      'SELECT * FROM users WHERE role = ?',
      ['worker']
    );

    res.json({
      success: true,
      data: workers.map(worker => ({
        id: worker.id,
        name: worker.name,
        phoneNumber: worker.phone_number,
        email: worker.email
      }))
    });
  } catch (error) {
    console.error('Error getting workers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get workers'
    });
  }
}

export async function updateBooking(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const db = await getDb();
    await db.run(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking'
    });
  }
}