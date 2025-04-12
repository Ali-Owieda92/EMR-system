import HealthTracking from "../models/HealthTracking.js";
import asyncHandler from "express-async-handler";

// ✅ POST /health-tracking/add ➝ تسجيل بيانات صحية
export const addHealthData = asyncHandler(async (req, res) => {
  const { bloodPressure, bloodSugar, heartRate, weight } = req.body;

  const healthRecord = new HealthTracking({
    userId: req.user._id,
    bloodPressure,
    bloodSugar,
    heartRate,
    weight,
  });

  const createdRecord = await healthRecord.save();
  res.status(201).json(createdRecord);
});

// ✅ GET /health-tracking/:userId ➝ جلب جميع البيانات الصحية للمستخدم
export const getHealthData = asyncHandler(async (req, res) => {
  const records = await HealthTracking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(records);
});

// ✅ GET /health-tracking/graph/:userId ➝ رسم بياني لتطور الحالة الصحية
export const getHealthGraph = asyncHandler(async (req, res) => {
  const records = await HealthTracking.find({ userId: req.params.userId }).sort({ createdAt: 1 });

  const graphData = records.map(record => ({
    date: record.createdAt,
    bloodPressure: record.bloodPressure,
    bloodSugar: record.bloodSugar,
    heartRate: record.heartRate,
    weight: record.weight,
  }));

  res.json(graphData);
});

// ✅ PUT /health-tracking/update/:recordId ➝ تعديل بيانات صحية مسجلة
export const updateHealthData = asyncHandler(async (req, res) => {
  const record = await HealthTracking.findById(req.params.recordId);

  if (!record) {
    res.status(404);
    throw new Error("Health record not found");
  }

  if (record.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this record");
  }

  record.bloodPressure = req.body.bloodPressure || record.bloodPressure;
  record.bloodSugar = req.body.bloodSugar || record.bloodSugar;
  record.heartRate = req.body.heartRate || record.heartRate;
  record.weight = req.body.weight || record.weight;

  const updatedRecord = await record.save();
  res.json(updatedRecord);
});

// ✅ DELETE /health-tracking/delete/:recordId ➝ حذف بيانات صحية معينة
export const deleteHealthData = asyncHandler(async (req, res) => {
  const record = await HealthTracking.findById(req.params.recordId);

  if (!record) {
    res.status(404);
    throw new Error("Health record not found");
  }

  if (record.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this record");
  }

  await record.remove();
  res.json({ message: "Health record deleted successfully" });
});
