import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register a new user (Doctor, Patient, Admin)
export const registerUser = async (req, res) => {
    const { name, email, password, role, specialization, gender, date_of_birth } = req.body;

    try {
      // Check if user exists
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

      // Create new user
        const newUser = new User({ name, email, password, role, specialization, gender, date_of_birth });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" , data: {newUser}, token});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        res.json({
            token: generateToken(user._id, user.role),
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error, data: {email, password} });
    }
};