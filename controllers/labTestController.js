import cloudinary from "../config/cloudinary.js";
import fs from "fs"; // لحذف الملفات المحلية بعد الرفع
import LabTest from "../models/LabTest.js";
import Patient from "../models/Patient.js";

// دالة رفع التحليل (رفع الملف إلى Cloudinary)
export const uploadLabTest = async (req, res) => {
  const { patientId, testType, testDate, testResult, remarks, retestRequired } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // رفع الملف إلى Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "lab_tests",
    });

    // حذف الملف المحلي بعد رفعه إلى Cloudinary
    fs.unlinkSync(file.path);

    const newLabTest = new LabTest({
      patient: patientId,
      testType,
      testDate,
      testResult,
      file: result.secure_url, // حفظ الرابط الآمن للملف
      remarks,
      retestRequired,
    });

    await newLabTest.save();
    res.status(201).json({
      success: true,
      message: "Lab test uploaded successfully",
      data: newLabTest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// دالة إضافة تحليل جديد
export const addLabTest = async (req, res) => {
  const { patientId, testType, testDate, testResult, file, remarks, retestRequired } = req.body;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // إذا كان في ملف مرفق
    let fileUrl = file;
    if (file) {
      const result = await cloudinary.uploader.upload(file, { folder: "lab_tests" });
      fileUrl = result.secure_url;
    }

    const newLabTest = new LabTest({
      patient: patientId,
      testType,
      testDate,
      testResult,
      file: fileUrl,
      remarks,
      retestRequired,
    });

    await newLabTest.save();
    res.status(201).json({ message: "Lab test added successfully", newLabTest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// دالة جلب جميع التحاليل لمريض معين
export const getLabTestsByPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const labTests = await LabTest.find({ patient: patientId });
    res.status(200).json(labTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// دالة جلب تفاصيل تحليل معين
export const getLabTestDetails = async (req, res) => {
  const { testId } = req.params;

  try {
    const labTest = await LabTest.findById(testId);
    if (!labTest) {
      return res.status(404).json({ message: "Lab test not found" });
    }
    res.status(200).json(labTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// دالة تحديث بيانات التحليل
export const updateLabTest = async (req, res) => {
  const { testId } = req.params;
  const { testResult, remarks, retestRequired } = req.body;

  try {
    const updatedLabTest = await LabTest.findByIdAndUpdate(
      testId,
      { testResult, remarks, retestRequired },
      { new: true }
    );
    if (!updatedLabTest) {
      return res.status(404).json({ message: "Lab test not found" });
    }
    res.status(200).json({ message: "Lab test updated successfully", updatedLabTest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// دالة حذف تحليل معين
export const deleteLabTest = async (req, res) => {
  const { testId } = req.params;

  try {
    const labTest = await LabTest.findByIdAndDelete(testId);
    if (!labTest) {
      return res.status(404).json({ message: "Lab test not found" });
    }
    res.status(200).json({ message: "Lab test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
