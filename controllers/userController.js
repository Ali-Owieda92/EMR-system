import User from "../models/User.js";
import Patient from "../models/Patient.js";

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "patient") {
        const patientData = await Patient.findOne({ user_id: user._id });
        return res.json({ user, patientData });
    }

    res.json({ user });
} catch (error) {
    res.status(500).json({ message: "Server error", error });
}
};

// ✅ Update User Profile (Including Profile Picture)
export const updateUserProfile = async (req, res) => {
try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.profilePhoto = req.body.profilePhoto || user.profilePhoto;
    await user.save();

    res.json({ message: "Profile updated successfully", user });
} catch (error) {
    res.status(500).json({ message: "Server error", error });
}
};
