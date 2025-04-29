import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendSMS } from "../utils/sendSMS.js";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
    const { name, email, phone, password, role, city, gender, age } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    try {
        if (existingUser) {
            return res.status(400).json({ message: "User already exists try to login with email or phone" });
        }

        const newUser = new User({
            name,
            email,
            phone,
            password,
            role,
            city,
            gender,
            age
        });

        await newUser.save();

        // ✨ إرسال رسالة ترحيبية حسب الوسيلة المتوفرة
        if (newUser.email) {
            await sendEmail({
                to: newUser.email,
                subject: "Welcome to EMR System",
                text: `Hello ${newUser.name},\n\nYour account has been successfully registered in the EMR system.`
            });
        }
        
        if (newUser.phone) {
            await sendSMS({
                to: newUser.phone,
                body: `Hi ${newUser.name}, your EMR account has been successfully created.`
            });
        }

        // ✨ إنشاء سجلات إضافية حسب الدور
        if (role === "patient") {
            await Patient.create({
                user_id: newUser._id,
                chronic_diseases: [],
                contact_info: { phone },
            });
        } else if (role === "doctor") {
            await Doctor.create({
                user: newUser._id,
                specialty: "",
                experience: 0,
                hospital: "",
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
    const { email, phone } = req.body;
    try {
        if (!email && !phone) {
            return res.status(400).json({ message: "Please provide email or phone" });
        }
        const user = await User.findOne({
            $or: [
                { email: email?.toLowerCase() },
                { phone }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found with this email or phone" });
        }

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" } 
        );

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        
        if (user.email) {
            console.log(`Sending email to: ${user.email}`);  // إضافة تسجيل في السجل هنا
            await sendEmail({
                to: user.email,
                subject: "Password Reset Link",
                text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
            });
        }
        if (user.phone) {
            console.log(`Sending SMS to: ${user.phone}`);  // إضافة تسجيل في السجل هنا

            await sendSMS({
                to: user.phone,
                message: `Password Reset: Click here to reset your password: ${resetLink}`,
            });
        }
        return res.status(200).json({
            message: "Reset link has been generated",
            resetLink, 
            token: resetToken
        });


    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(400).json({ message: "User not found or invalid token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token", error });
    }
}; 