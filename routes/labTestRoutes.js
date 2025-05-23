import express from "express";
import {
  uploadLabTest,
  addLabTest,
  getLabTestsByPatient,
  getLabTestDetails,
  updateLabTest,
  deleteLabTest,
} from "../controllers/labTestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧪 نظام متابعة التحاليل والفحوصات
router.post("/upload", protect, uploadLabTest);             // رفع تحليل جديد (PDF أو صورة)
router.post("/add", protect, addLabTest);             // رفع تحليل جديد (PDF أو صورة)
router.get("/:patientId", protect, getLabTestsByPatient);                           // جلب جميع التحاليل لمريض معين
router.get("/details/:testId", protect, getLabTestDetails);                          // جلب تفاصيل تحليل معين
router.put("/update/:testId", protect, updateLabTest);                               // تحديث بيانات التحليل
router.delete("/delete/:testId", protect, deleteLabTest);                            // حذف تحليل معين

export default router;
