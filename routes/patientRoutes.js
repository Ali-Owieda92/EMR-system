import express from "express";
import {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPatientsByDoctor,
} from "../controllers/patientController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

router.post("/create", protect, authorize("doctor", "admin"), upload.single("profileImage"), createPatient);
router.get("/all", protect, authorize("doctor", "admin"), getAllPatients);
router.get("/doctor", protect, authorize("doctor"), getPatientsByDoctor); 
router.get("/:patientId", protect, getPatientById);
router.put("/update/:patientId", protect, upload.single("profileImage"), updatePatient);
router.delete("/delete/:patientId", protect, authorize("admin"), deletePatient);

export default router;
