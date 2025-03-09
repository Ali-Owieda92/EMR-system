import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to patient
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to doctor
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Example: "10:30 AM"
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    reason: { type: String } // Reason for appointment
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
