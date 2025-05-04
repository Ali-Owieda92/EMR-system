import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chronic_diseases: [{ type: String }],
  blood_type: { type: String },
  contact_info: {
    phone: { type: String },
    address: { type: String },
  },
  profilePhoto: {
    type: String,
    default: "uploads/default.jpg",
  },
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;