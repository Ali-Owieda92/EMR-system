import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    datetime: { type: Date, required: true }, // ✅ تم دمج `date` و `time` في حقل واحد
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    reason: { type: String }
}, { timestamps: true });

// ✅ منع حجز أكثر من موعد لنفس الطبيب في نفس التوقيت
appointmentSchema.index({ doctor_id: 1, datetime: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
