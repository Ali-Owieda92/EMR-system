import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async ({ to, body }) => {
    try {
        // إرسال الرسالة عبر Twilio
        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE, // رقم Twilio الذي تستخدمه
            to,
        });
        
        console.log(`✅ SMS sent successfully to ${to}, Message SID: ${message.sid}`);
    } catch (error) {
        console.error('❌ Error sending SMS:', error.message); // إضافة .message لتوضيح تفاصيل الخطأ
        throw error; // إعادة رمي الخطأ بعد تسجيله
    }
};