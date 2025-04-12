import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
    const { identifier } = req.body;

    try {
    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
        message: "User verified. You can now reset the password.",
        userId: user._id,
    });
    } catch (error) {
    res.status(500).json({ message: "Server error", error });
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
