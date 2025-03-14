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

        res.status(201).json({ message: "User registered successfully" });
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
        res.status(500).json({ message: "Server error", error });
    }
};


// ✅ Logout - Remove Token from Active Sessions
export const logoutUser = async (req, res) => {
try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove the current token from the user's tokens array
    user.tokens = user.tokens.filter(t => t.token !== req.token);
    await user.save();

    res.json({ message: "Logged out successfully" });
} catch (error) {
    res.status(500).json({ message: "Server error", error });
}
};

// ✅ Logout from All Devices (Clear all tokens)
export const logoutAllDevices = async (req, res) => {
try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.tokens = []; // Clear all session tokens
    await user.save();

    res.json({ message: "Logged out from all devices" });
} catch (error) {
    res.status(500).json({ message: "Server error", error });
}
}; 