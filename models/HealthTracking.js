import mongoose from "mongoose";

const healthTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bloodPressure: {
      type: String,
    },
    bloodSugar: {
      type: Number,
    },
    heartRate: {
      type: Number,
    },
    weight: {
      type: Number,
    },
  },
  { timestamps: true }
);

const HealthTracking = mongoose.model("HealthTracking", healthTrackingSchema);
export default HealthTracking;
