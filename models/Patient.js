import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to Users collection
    chronic_diseases: [{ type: String }],
    blood_type: { type: String },
    contact_info: {
        phone: { type: String },
        address: { type: String },
    },
    medical_history: [
        {
            diagnosis: { type: String },
            doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Doctor
            medications: [{ name: String, dosage: String, duration: String }],
            date: { type: Date, default: Date.now },
        }
    ]
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
