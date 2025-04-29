export const sendSMS = async ({ to, body }) => {
    try {
        await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE,
            to,
        });
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error; // إعادة رمي الخطأ بعد تسجيله
    }
};
