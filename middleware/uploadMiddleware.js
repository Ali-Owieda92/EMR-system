// Updated middleware/uploadMiddleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "du8lldi3f", // Cloudinary folder name
        allowed_formats: ["jpg", "jpeg", "png", "pdf"],
        transformation: [{ width: 500, height: 500, crop: "limit" }] // Optional image transformations
    },
});

// Set up multer with file size limits
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images and PDF files are allowed!"));
    }
});

export default upload;