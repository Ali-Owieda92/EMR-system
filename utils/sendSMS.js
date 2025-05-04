import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async ({ to, body }) => {
    if (process.env.NODE_ENV === 'production') {
        try {
            const message = await client.messages.create({
                body,
                from: process.env.TWILIO_PHONE,
                to,
            });

            console.log(`✅ SMS sent successfully to ${to}, SID: ${message.sid}`);
        } catch (error) {
            console.error('❌ Error sending SMS:', error.message);
            throw error;
        }
    } else {
        // 🧪 Development mode: لا تبعت SMS فعلي، اطبع في الكونسول بس
        console.log(`📱 (Mock SMS) To: ${to} | Body: ${body}`);
    }
};