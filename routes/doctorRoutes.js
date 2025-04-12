import express from "express";
import {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
} from "../controllers/doctorController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟨 إدارة الأطباء
router.post("/create", protect, authorize("admin"), createDoctor);
router.get("/list", getAllDoctors); // متاح للجميع للبحث
router.get("/:doctorId", protect, authorize("admin", "doctor"), getDoctorById);
router.put("/update/:doctorId", protect, updateDoctor);
router.delete("/delete/:doctorId", protect, authorize("admin"), deleteDoctor);

export default router;
