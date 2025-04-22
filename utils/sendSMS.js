import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendSMS = async ({ to, body }) => {
    await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE,
        to,
    });
};
