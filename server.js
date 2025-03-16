import express from "express";
// for building server-side applications, handling routes, and APIs
import dotenv from "dotenv";
// used to load environment variables from a .env file into process.env
import cors from "cors";
// allows your server to handle requests from different origins 
import connectDB from "./config/db.js";
// functions to access on database
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
// Routes contain our whole application

dotenv.config();
// use dotenv libarary
connectDB();
// use connectDB function in out app

const app = express();
// use express framework
app.use(express.json());
// make the request in JSON {key: value}
app.use(cors());
// use cors libarary to make for example frontend to access on our application (retrive data, upload, and so on)

app.use("/api/auth", authRoutes);
// http://localhost:5000/api/auth/register  to reach to register page
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);


const PORT = process.env.PORT || 5000;
// Where is the server work in our local host
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Start express server