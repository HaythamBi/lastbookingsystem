import twilio from 'twilio';
import { getDb } from '../config/database.js';
import { formatDate, formatTime, addMinutes } from '../utils/dateUtils.js';

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const REMINDER_TIMES = {
  DAY_BEFORE: 24 * 60,  // 24 hours in minutes
  HOUR_BEFORE: 60,      // 1 hour in minutes
};

export async function scheduleReminders(booking, customer) {
  const db = await getDb();
  const reminders = generateReminderTimes(booking);

  try {
    for (const reminder of reminders) {
      await db.run(
        `INSERT INTO reminders (
          booking_id,
          customer_id,
          type,
          send_at,
          status
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          booking.id,
          customer.id,
          reminder.type,
          reminder.sendAt.toISOString(),
          'pending'
        ]
      );
    }

    return true;
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    throw error;
  }
}

export async function processReminders() {
  const db = await getDb();
  const now = new Date();

  try {
    // Get pending reminders that should be sent
    const reminders = await db.all(
      `SELECT r.*, b.*, c.* 
       FROM reminders r
       JOIN bookings b ON r.booking_id = b.id
       JOIN users c ON r.customer_id = c.id
       WHERE r.status = 'pending' 
       AND r.send_at <= datetime('now')
       AND b.status = 'confirmed'`
    );

    for (const reminder of reminders) {
      try {
        const message = generateReminderMessage(reminder);
        const sent = await sendWhatsAppMessage(
          reminder.phone_number,
          message
        );

        await db.run(
          `UPDATE reminders 
           SET status = ?, sent_at = ?, error = ? 
           WHERE id = ?`,
          [
            sent ? 'sent' : 'failed',
            now.toISOString(),
            sent ? null : 'Failed to send WhatsApp message',
            reminder.id
          ]
        );
      } catch (error) {
        console.error('Error processing reminder:', error);
        await db.run(
          `UPDATE reminders 
           SET status = ?, error = ? 
           WHERE id = ?`,
          ['failed', error.message, reminder.id]
        );
      }
    }
  } catch (error) {
    console.error('Error processing reminders:', error);
    throw error;
  }
}

function generateReminderTimes(booking) {
  const startTime = new Date(booking.startTime);
  
  return [
    {
      type: 'day_before',
      sendAt: addMinutes(startTime, -REMINDER_TIMES.DAY_BEFORE),
    },
    {
      type: 'hour_before',
      sendAt: addMinutes(startTime, -REMINDER_TIMES.HOUR_BEFORE),
    },
  ];
}

function generateReminderMessage(reminder) {
  const startTime = new Date(reminder.start_time);
  const formattedDate = formatDate(startTime);
  const formattedTime = formatTime(startTime);

  const messages = {
    day_before: `Hi ${reminder.name}! 👋 Just a reminder that you have a booking tomorrow at ${formattedTime}. We're looking forward to seeing you!`,
    hour_before: `Hi ${reminder.name}! Your booking is in 1 hour at ${formattedTime}. See you soon! 😊`,
  };

  return messages[reminder.type] || messages.day_before;
}

async function sendWhatsAppMessage(to, message) {
  if (!client) {
    console.log('WhatsApp message (development):', { to, message });
    return true;
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    });

    return !!response.sid;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}