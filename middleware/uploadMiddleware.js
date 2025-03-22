import multer from "multer";
import path from "path";

// إعداد التخزين للصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // تخزين الصور في مجلد uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// فلترة الملفات لقبول الصور فقط
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb("Error: Only images are allowed!");
};

const upload = multer({ storage, fileFilter });

export default upload;
