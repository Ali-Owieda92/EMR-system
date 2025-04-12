import express from "express";
import {
    addHealthData,
    getHealthData,
    getHealthGraph,
    updateHealthData,
    deleteHealthData,
} from "../controllers/healthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addHealthData);
router.get("/:userId", protect, getHealthData);
router.get("/graph/:userId", protect, getHealthGraph);
router.put("/update/:recordId", protect, updateHealthData);
router.delete("/delete/:recordId", protect, deleteHealthData);

export default router;