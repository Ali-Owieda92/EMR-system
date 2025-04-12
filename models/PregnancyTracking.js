import mongoose from "mongoose";

const pregnancyTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    conceptionDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const PregnancyTracking = mongoose.model("PregnancyTracking", pregnancyTrackingSchema);
export default PregnancyTracking;
