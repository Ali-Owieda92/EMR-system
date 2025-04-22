import Patient from "../models/Patient.js";
import User from "../models/User.js";

export const createPatient = async (req, res) => {
    const { name, email, phone, gender, chronic_diseases, blood_type, city } = req.body;

    try {
        // 🔒 Role check
        if (req.user.role !== "doctor" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only doctors and admins can add patients." });
        }

        // 🔍 Check if user exists by email
        let user = await User.findOne({ email });

        if (user && (!user.gender || !user.phone)) {
            return res.status(400).json({
                message: "User already exists but missing required data. Please provide full user info or use another email."
            });
        }

        // ❌ If not, create a new user with role = patient
        if (!user) {
            user = new User({
                name,
                email,
                phone,       
                gender,      
                city,        
                password: "12345678", 
                role: "patient",
            });

            // 📸 Attach uploaded image if available
            if (req.file) {
                user.profile_image = req.file.filename;
            }

            await user.save();
        }

        const patientExists = await Patient.findOne({ user_id: user._id });
        if (patientExists) {
            return res.status(400).json({ message: "Patient already exists" });
        }

        const newPatient = new Patient({
            user_id: user._id,
            chronic_diseases,
            blood_type,
            contact_info: {
                phone,
                address: city,
            },
        });

        await newPatient.save();

        res.status(201).json({ message: "Patient record created successfully", patient: newPatient });

    } catch (error) {
        console.error("Error creating patient:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        let patients;

        if (req.user.role === "admin") {
            patients = await Patient.find().populate("user_id", "name email profile_image gender date_of_birth");
        } else if (req.user.role === "doctor") {
            patients = await Patient.find({ "medical_history.doctor_id": req.user._id })
                .populate("user_id", "name email profile_image gender date_of_birth");
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate("user_id", "name email gender date_of_birth profile_image");
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        if (req.user.role !== "admin" && req.user.role !== "doctor" && req.user._id.toString() !== patient.user_id._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate("user_id");
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const user = patient.user_id;

        if (req.user.role === "patient" && req.user._id.toString() === patient.user_id._id.toString()) {
            const { contact_info } = req.body;
            if (contact_info) patient.contact_info = contact_info;
            if (req.file?.filename) user.profile_image = req.file.filename;
        }
        else if (req.user.role === "doctor") {
            if (!patient.medical_history.some(record => record.assigned_doctor.toString() === req.user._id.toString())) {
                return res.status(403).json({ message: "Access denied" });
            }
            const { chronic_diseases, medical_history } = req.body;
            if (chronic_diseases) patient.chronic_diseases = chronic_diseases;
            if (medical_history) patient.medical_history.push(medical_history);
        }
        else if (req.user.role === "admin") {
            Object.assign(patient, req.body);
            if (req.file?.filename) user.profile_image = req.file.filename;
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        await user.save();
        await patient.save();
        res.json({ message: "Patient updated successfully", patient });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        await User.findByIdAndDelete(patient.user_id);
        await patient.deleteOne();

        res.json({ message: "Patient record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
export const getPatientsByDoctor = async (req, res) => {
    const doctorId = req.user._id;

    const patients = await Patient.find({ createdBy: doctorId }).populate("user_id", "name email phone");

    res.status(200).json({
        success: true,
        count: patients.length,
        data: patients,
    });
};