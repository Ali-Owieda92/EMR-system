import express from "express";
import {
    addMenstrualCycle,
    getMenstrualCycle,
    addPregnancyTracking,
    getPregnancyTracking,
    sendWomenReminders,
} from "../controllers/womenHealthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/menstrual-cycle", protect, addMenstrualCycle);
router.get("/menstrual-cycle/:userId", protect, getMenstrualCycle);
router.post("/pregnancy-tracking", protect, addPregnancyTracking);
router.get("/pregnancy-tracking/:userId", protect, getPregnancyTracking);
router.post("/reminders", protect, sendWomenReminders);

export default router;