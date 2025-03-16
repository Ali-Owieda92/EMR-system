import Patient from "../models/Patient.js";
import User from "../models/User.js";

// Create a new patient
export const createPatient = async (req, res) => {
    const user_id = req.user._id;
    const {chronic_diseases, blood_type, contact_info } = req.body;

    try {
        const user = await User.findById(user_id);
        if (!user || user.role !== "patient") {
            return res.status(404).json({ message: "Patient user not found" });
        }

        const newPatient = new Patient({ user_id, chronic_diseases, blood_type, contact_info });
        await newPatient.save();

        res.status(201).json({ message: "Patient record created", patient: newPatient });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all patients (For doctors/admins)
export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate("user_id", "name email gender date_of_birth");
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a single patient by ID
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate("user_id", "name email gender date_of_birth");
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update patient details
export const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        Object.assign(patient, req.body);
        await patient.save();

        res.json({ message: "Patient updated successfully", patient });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a patient record
export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        await patient.deleteOne();
        res.json({ message: "Patient record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};