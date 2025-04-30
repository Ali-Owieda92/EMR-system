import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text }) => {
    // إعداد النقل باستخدام Gmail
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // يستخدم SSL
        auth: {
            user: process.env.EMAIL_USER, // البريد الإلكتروني المستخدم
            pass: process.env.EMAIL_PASS, // كلمة المرور الخاصة بتطبيق Gmail
        },
    });

    const mailOptions = {
        from: `"EMR System" <${process.env.EMAIL_USER}>`, // الاسم المعروض في البريد المرسل
        to, // البريد الإلكتروني للمستلم
        subject, // موضوع الرسالة
        text, // نص الرسالة
    };

    try {
        await transporter.sendMail(mailOptions); // إرسال البريد
        console.log('✅ Email sent successfully');
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error; // إعادة رمي الخطأ بعد تسجيله
    }
};
