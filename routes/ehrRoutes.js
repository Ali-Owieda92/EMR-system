// Updated routes/ehrRoutes.js
import express from "express";
import {
    getEhrByPatient,
    addEhrData,
    updateEhr,
    downloadEhrPdf,
    getEhrQrCode
} from "../controllers/ehrController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// EHR routes
router.get("/:patientId", protect, getEhrByPatient);                   // Get full EHR for a patient
router.post("/add", protect, authorize("doctor", "admin"), addEhrData); // Add new EHR data
router.put("/update/:patientId", protect, authorize("doctor", "admin"), updateEhr); // Update EHR
router.get("/download/:patientId", protect, downloadEhrPdf);           // Download EHR as PDF
router.get("/qrcode/:patientId", protect, getEhrQrCode);               // Get QR code for EHR

export default router;