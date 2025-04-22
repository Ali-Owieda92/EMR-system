import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // جيميلك
        pass: process.env.EMAIL_PASS, // App password من جوجل
    },
});

    const mailOptions = {
        from: `"EMR System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};