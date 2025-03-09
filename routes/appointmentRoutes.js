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

router.post("/", protect, bookAppointment); // Book appointment
router.get("/", protect, getAllAppointments); // Get all appointments
router.get("/patient/:patientId", protect, getPatientAppointments); // Get patient appointments
router.get("/doctor/:doctorId", protect, getDoctorAppointments); // Get doctor appointments
router.put("/:id", protect, updateAppointmentStatus); // Update appointment status
router.delete("/:id", protect, deleteAppointment); // Delete appointment

export default router;
