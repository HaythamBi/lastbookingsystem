import { getDb } from '../config/database.js';
import { randomUUID } from 'crypto';

export async function getCustomerBookingsHandler(req, res) {
  const { customerId } = req.params;

  try {
    const db = await getDb();
    const bookings = await db.all(
      `SELECT b.*, u.name as customer_name, u.phone_number
       FROM bookings b
       LEFT JOIN users u ON b.customer_id = u.id
       WHERE b.customer_id = ? 
       AND b.status != 'cancelled'
       ORDER BY b.start_time DESC`,
      [customerId]
    );

    res.json({ 
      success: true, 
      data: bookings.map(booking => ({
        ...booking,
        startTime: booking.start_time,
        endTime: booking.end_time,
        customerName: booking.customer_name
      }))
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
}

export async function createBookingHandler(req, res) {
  const { customerId, startTime, endTime, machineId } = req.body;

  try {
    const db = await getDb();
    const bookingId = randomUUID();
    
    await db.run(
      `INSERT INTO bookings (id, customer_id, start_time, end_time, machine_id, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bookingId, customerId, startTime, endTime, machineId, 'confirmed']
    );

    res.json({ 
      success: true, 
      data: { id: bookingId }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
}

export async function cancelBookingHandler(req, res) {
  const { id } = req.params;
  const { customerId } = req.body;

  try {
    const db = await getDb();
    
    await db.run(
      'UPDATE bookings SET status = ? WHERE id = ? AND customer_id = ?',
      ['cancelled', id, customerId]
    );

    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
}