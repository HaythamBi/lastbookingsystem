import { getDb } from '../config/database.js';
import { randomUUID } from 'crypto';
import { BOOKING_CONSTRAINTS } from '../utils/constants.js';

export async function getCustomerBookings(customerId) {
  const db = await getDb();
  const bookings = await db.all(
    `SELECT b.*, u.name as customer_name, u.phone_number
     FROM bookings b
     JOIN users u ON b.customer_id = u.id
     WHERE b.customer_id = ? 
     AND b.status != 'cancelled'
     ORDER BY b.start_time DESC`,
    [customerId]
  );

  return bookings.map(booking => ({
    ...booking,
    startTime: new Date(booking.start_time),
    endTime: new Date(booking.end_time)
  }));
}

export async function createBooking(bookingData) {
  const db = await getDb();
  const { customerId, startTime, endTime, machineId } = bookingData;
  
  await db.run('BEGIN TRANSACTION');

  try {
    // Check for existing bookings
    const existingBookings = await db.get(
      `SELECT COUNT(*) as count 
       FROM bookings 
       WHERE machine_id = ? 
       AND status = 'confirmed'
       AND (
         (start_time <= ? AND end_time > ?) OR
         (start_time < ? AND end_time >= ?)
       )`,
      [machineId, startTime, startTime, endTime, endTime]
    );

    if (existingBookings.count > 0) {
      throw new Error('Time slot already booked');
    }

    const bookingId = randomUUID();
    
    await db.run(
      `INSERT INTO bookings (
        id, customer_id, start_time, end_time, machine_id, status
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [bookingId, customerId, startTime, endTime, machineId, 'confirmed']
    );

    await db.run('COMMIT');
    return bookingId;
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

export async function cancelBooking(bookingId, customerId) {
  const db = await getDb();
  
  const booking = await db.get(
    'SELECT * FROM bookings WHERE id = ? AND customer_id = ?',
    [bookingId, customerId]
  );

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking already cancelled');
  }

  const startTime = new Date(booking.start_time);
  const now = new Date();
  const hoursDifference = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursDifference < BOOKING_CONSTRAINTS.MIN_HOURS_BEFORE_BOOKING) {
    throw new Error('Cannot cancel bookings less than 2 hours before start time');
  }

  await db.run(
    'UPDATE bookings SET status = ? WHERE id = ?',
    ['cancelled', bookingId]
  );

  return true;
}