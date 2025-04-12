import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

export const createDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, gender, date_of_birth } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Doctor already exists" });

        const newUser = new User({
            name,
            email,
            password,
            role: "doctor",
            specialization,
            gender,
            date_of_birth,
        });

        if (req.file) {
            newUser.profile_image = req.file.filename;
        }

        await newUser.save();

        const newDoctor = new Doctor({
            user_id: newUser._id,
            specialization,
        });

        await newDoctor.save();

        res.status(201).json({ message: "Doctor created successfully", doctor: newDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate("user_id", "name email profile_image specialization gender date_of_birth");
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate("user_id", "-password");
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate("user_id");
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const user = doctor.user_id;

        const { name, email, gender, date_of_birth, specialization, phone, bio } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (gender) user.gender = gender;
        if (date_of_birth) user.date_of_birth = date_of_birth;
        if (req.file?.filename) user.profile_image = req.file.filename;

        if (specialization) doctor.specialization = specialization;
        if (phone) doctor.phone = phone;
        if (bio) doctor.bio = bio;

        await user.save();
        await doctor.save();

        res.json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        await User.findByIdAndDelete(doctor.user_id);
        await doctor.deleteOne();

        res.json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};