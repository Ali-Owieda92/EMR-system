import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    user_id: 
        {  
            type: mongoose.Schema.Types.ObjectId,  
            ref: "User", 
            required: true 
        },
    chronic_diseases: [{ type: String }],
    blood_type: { type: String },
    contact_info: {
        phone: { type: String, required: true },
        address: { type: String },
    },
    medical_history: [
        {
            diagnosis: { type: String },
            assigned_doctor: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            medications: [{ name: String, dosage: String, duration: String }],
            date: { type: Date, default: Date.now },
        }
    ],
    profilePhoto: {
        type: String,
        default: "uploads/default.jpg",
    }  
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
