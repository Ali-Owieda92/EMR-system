import express from "express";
import {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
} from "../controllers/doctorController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

// 🟨 إدارة الأطباء
router.post("/create", protect, authorize("admin"), upload.single("profileImage"), createDoctor);
router.get("/list", getAllDoctors); // متاح للجميع للبحث
router.get("/:doctorId", protect, authorize("admin", "doctor"), getDoctorById);
router.put("/update/:doctorId", protect, upload.single("profileImage"), updateDoctor);
router.delete("/delete/:doctorId", protect, authorize("admin"), deleteDoctor);

export default router;
