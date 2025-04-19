import express from "express";

import {
    getEhrByPatient,
    addEhrData,
    updateEhr,
} from "../controllers/ehrController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📂 نظام السجل الطبي الإلكتروني (EHR)
router.get("/:patientId", protect, getEhrByPatient);              // جلب السجل الطبي الكامل لمريض معين
router.post("/add", protect, addEhrData);                           // إضافة بيانات جديدة (مرض مزمن، أدوية، عمليات سابقة)
router.put("/update/:patientId", protect, updateEhr);               // تحديث بيانات السجل الطبي

export default router;
