import express from "express";
import {
    bookAppointment,
    getAllAppointments,
    getPatientAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    deleteAppointment
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("patient"), bookAppointment); // ✅ فقط المرضى يمكنهم حجز موعد
router.get("/", protect, authorize("admin", "doctor"), getAllAppointments); // ✅ فقط الأطباء والإداريين يمكنهم رؤية كل المواعيد
router.get("/patient/:patientId", protect, authorize("patient", "admin"), getPatientAppointments); // ✅ المريض أو الأدمن فقط
router.get("/doctor/:doctorId", protect, authorize("doctor", "admin"), getDoctorAppointments); // ✅ الطبيب أو الأدمن فقط
router.put("/:id", protect, authorize("doctor", "admin"), updateAppointmentStatus); // ✅ الطبيب أو الأدمن فقط يمكنهم تحديث الحالة
router.delete("/:id", protect, authorize("admin"), deleteAppointment); // ✅ فقط الأدمن يمكنه حذف موعد

