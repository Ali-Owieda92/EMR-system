import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", protect, getUserProfile); // Get user profile
router.put("/", protect, updateUserProfile); // Update profile

export default router;
