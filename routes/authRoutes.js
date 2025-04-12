import express from "express";
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);                       
router.post("/login", loginUser);                           
router.post("/forgot-password", forgotPassword);        
router.post("/reset-password", resetPassword);             

export default router;
