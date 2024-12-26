import twilio from 'twilio';
import { formatDate, formatTime } from '../utils/dateUtils.js';

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function sendWhatsAppMessage(to, message) {
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

    console.log('WhatsApp message sent:', response.sid);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

export function generateBookingConfirmationMessage(booking, customer) {
  const date = formatDate(new Date(booking.startTime));
  const time = formatTime(new Date(booking.startTime));

  return `Hello ${customer.name}! 👋\n\nYour booking has been confirmed:\n📅 Date: ${date}\n⏰ Time: ${time}\n🔧 Machine #${booking.machineId}\n\nSee you soon! 😊`;
}