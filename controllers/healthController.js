// Updated controllers/healthController.js
import HealthTracking from "../models/HealthTracking.js";
import asyncHandler from 'express-async-handler';

// Add health data
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

// Get all health data for a user
export const getHealthData = asyncHandler(async (req, res) => {
  // Ensure user can only access their own data unless they're a doctor or admin
  if (req.params.userId !== req.user._id.toString() && 
      req.user.role !== 'doctor' && 
      req.user.role !== 'admin') {
    res.status(403);
    throw new Error("Not authorized to access this data");
  }

  const records = await HealthTracking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(records);
});

// Get graph data for health metrics
export const getHealthGraph = asyncHandler(async (req, res) => {
  // Ensure user can only access their own data unless they're a doctor or admin
  if (req.params.userId !== req.user._id.toString() && 
      req.user.role !== 'doctor' && 
      req.user.role !== 'admin') {
    res.status(403);
    throw new Error("Not authorized to access this data");
  }

  // Get data from the past 30 days by default
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const records = await HealthTracking.find({
    userId: req.params.userId,
    createdAt: { $gte: startDate, $lte: endDate }
  }).sort({ createdAt: 1 });

  // Format data for graphs
  const graphData = {
    labels: records.map(record => record.createdAt.toISOString().split('T')[0]), // Date strings
    bloodPressure: records.map(record => {
      if (!record.bloodPressure) return null;
      // Parse values like "120/80" into [120, 80]
      const [systolic, diastolic] = record.bloodPressure.split('/').map(Number);
      return { systolic, diastolic };
    }),
    bloodSugar: records.map(record => record.bloodSugar),
    heartRate: records.map(record => record.heartRate),
    weight: records.map(record => record.weight)
  };

  res.json(graphData);
});

// Update health record
export const updateHealthData = asyncHandler(async (req, res) => {
  const record = await HealthTracking.findById(req.params.recordId);

  if (!record) {
    res.status(404);
    throw new Error("Health record not found");
  }

  // Ensure user can only update their own records
  if (record.userId.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin') {
    res.status(403);
    throw new Error("Not authorized to update this record");
  }

  record.bloodPressure = req.body.bloodPressure || record.bloodPressure;
  record.bloodSugar = req.body.bloodSugar || record.bloodSugar;
  record.heartRate = req.body.heartRate || record.heartRate;
  record.weight = req.body.weight || record.weight;

  const updatedRecord = await record.save();
  res.json(updatedRecord);
});

// Delete health record
export const deleteHealthData = asyncHandler(async (req, res) => {
  const record = await HealthTracking.findById(req.params.recordId);

  if (!record) {
    res.status(404);
    throw new Error("Health record not found");
  }

  // Ensure user can only delete their own records
  if (record.userId.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin') {
    res.status(403);
    throw new Error("Not authorized to delete this record");
  }

  await record.deleteOne();
  res.json({ message: "Health record deleted successfully" });
});