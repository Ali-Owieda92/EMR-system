export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        if (req.file) user.profilePhoto = req.file.path;
        if (req.body.name) user.name = req.body.name;
        if (req.body.gender) user.gender = req.body.gender;
        if (req.body.date_of_birth) user.date_of_birth = req.body.date_of_birth;

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
