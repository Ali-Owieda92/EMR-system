import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";// controllers/authController.js
import sendEmail from "../utils/emailService.js"; // هننشئ الملف بعد شويه

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
    const { name, email, phone, password, role, specialization, gender, date_of_birth } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or phone" });
    }

    const newUser = new User({
        name,
        email,
        phone,
        password,
        role,
        specialization,
        gender,
        date_of_birth,
    });

    await newUser.save();

    if (role === "patient") {
        await Patient.create({
            user_id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
        });
    } else if (role === "doctor") {
        await Doctor.create({
            user_id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            specialization: newUser.specialization,
        });
    }

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
        message: "User registered successfully",
        token,
        data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
        },
    });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const loginUser = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { email: email?.toLowerCase() },
                { phone }
            ]
        });

    if (!user) return res.status(401).json({ message: "Invalid email/phone or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email/phone or password" });

    res.json({
        token: generateToken(user._id, user.role),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        });
    } catch (error) {
    res.status(500).json({ message: "Server error", error });
    }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. تأكد من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // 2. أنشئ توكن مؤقت (15 دقيقة)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 3. أنشئ رابط إعادة التعيين
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // 4. أرسل الإيميل للمستخدم
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>You requested a password reset.</p>
             <p>Click this link to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`
    });

    res.status(200).json({ message: "Password reset link sent to email." });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const resetPassword = async (req, res) => {
    const { identifier, newPassword } = req.body;

    try {
        const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
