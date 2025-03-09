import express from "express";
import { createPatient, getAllPatients, getPatientById, updatePatient, deletePatient } from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPatient); // Create patient
router.get("/", protect, getAllPatients); // Get all patients
router.get("/:id", protect, getPatientById); // Get single patient
router.put("/:id", protect, updatePatient); // Update patient
router.delete("/:id", protect, deletePatient); // Delete patient

export default router;