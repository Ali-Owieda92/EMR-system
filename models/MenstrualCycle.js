import mongoose from "mongoose";

const menstrualCycleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const MenstrualCycle = mongoose.model("MenstrualCycle", menstrualCycleSchema);
export default MenstrualCycle;
