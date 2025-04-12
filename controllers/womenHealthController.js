import asyncHandler from "express-async-handler";
import MenstrualCycle from "../models/MenstrualCycle.js";
import PregnancyTracking from "../models/PregnancyTracking.js";
import sendReminderSMS from "../utils/sendReminderSMS.js"; // لو بتبعت SMS أو تذكيرات

// ✅ تسجيل مواعيد الدورة الشهرية
export const addMenstrualCycle = asyncHandler(async (req, res) => {
  const { startDate, duration } = req.body;

  const cycle = new MenstrualCycle({
    userId: req.user._id,
    startDate,
    duration,
  });

  const createdCycle = await cycle.save();
  res.status(201).json(createdCycle);
});

// ✅ جلب بيانات الدورة والتنبؤ
export const getMenstrualCycle = asyncHandler(async (req, res) => {
  const cycles = await MenstrualCycle.find({ userId: req.params.userId }).sort({ startDate: -1 });

  const latestCycle = cycles[0];
  let prediction = null;

  if (latestCycle) {
    const nextStart = new Date(latestCycle.startDate);
    nextStart.setDate(nextStart.getDate() + latestCycle.duration);

    prediction = {
      nextCycleStart: nextStart,
      estimatedEnd: new Date(nextStart.getTime() + latestCycle.duration * 24 * 60 * 60 * 1000),
    };
  }

  res.json({ cycles, prediction });
});

// ✅ تسجيل بيانات الحمل
export const addPregnancyTracking = asyncHandler(async (req, res) => {
  const { conceptionDate } = req.body;

  const pregnancy = new PregnancyTracking({
    userId: req.user._id,
    conceptionDate,
  });

  const saved = await pregnancy.save();
  res.status(201).json(saved);
});

// ✅ متابعة تطور الحمل
export const getPregnancyTracking = asyncHandler(async (req, res) => {
  const tracking = await PregnancyTracking.findOne({ userId: req.params.userId });

  if (!tracking) {
    res.status(404);
    throw new Error("No pregnancy tracking found");
  }

  const today = new Date();
  const conceptionDate = new Date(tracking.conceptionDate);
  const diffInWeeks = Math.floor((today - conceptionDate) / (7 * 24 * 60 * 60 * 1000));
  const dueDate = new Date(conceptionDate);
  dueDate.setDate(dueDate.getDate() + 280); // 40 أسبوع

  res.json({ ...tracking._doc, week: diffInWeeks, dueDate });
});

// ✅ إرسال تذكيرات
export const sendWomenReminders = asyncHandler(async (req, res) => {
  const { message, phoneNumber } = req.body;

  // Function ممكن تبعتها SMS أو Email أو Notification
  const result = await sendReminderSMS(phoneNumber, message);

  res.json({ success: true, result });
});
