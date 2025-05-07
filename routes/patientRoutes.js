import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPatientsByDoctor,
} from "../controllers/patientController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, authorize("doctor", "admin"), createPatient);
router.get("/all", protect, authorize("doctor", "admin"), getAllPatients);
router.get("/doctor", protect, authorize("doctor"), getPatientsByDoctor); 
router.get("/:patientId", protect, getPatientById);   
router.put("/update/:patientId", protect, upload.single("profilePhoto"), updatePatient);
router.delete("/delete/:patientId", protect, deletePatient);

export default router;