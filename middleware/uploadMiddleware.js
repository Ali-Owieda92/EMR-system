import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ نحدد التخزين بناءً على البيئة
let storage;

if (process.env.VERCEL === "1") {
  // Vercel → استخدم التخزين في الذاكرة
  storage = multer.memoryStorage();
} else {
  // Local → نخزن الملفات فعليًا
  const uploadPath = "uploads";
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
}

// ✅ فلتر أنواع الصور
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
  }
};

// ✅ الميدل وير النهائي
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB Max
});

export default upload;
