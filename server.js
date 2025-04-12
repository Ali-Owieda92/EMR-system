import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import ehrRoutes from "./routes/ehrRoutes.js";
import labTestRoutes from "./routes/labTestRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";       
import womenHealthRoutes from "./routes/womenHealthRoutes.js"; 

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes); // دا خلاص هنبقا نضيف الreset && forget password
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/ehr", ehrRoutes);
app.use("/lab-tests", labTestRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/health-tracking", healthRoutes);       
app.use("/women", womenHealthRoutes);              

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
