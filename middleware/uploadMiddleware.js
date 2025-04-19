// middleware/uploadMiddleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// إعداد التخزين على Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "du8lldi3f", // اسم المجلد في Cloudinary
        allowed_formats: ["jpg", "jpeg", "png"],
},
});

// إعداد Multer
const upload = multer({ storage });

export default upload;
