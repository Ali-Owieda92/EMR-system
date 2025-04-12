import multer from "multer";
import fs from "fs";

// نحدد طريقة التخزين بناءً على البيئة
let storage;

if (process.env.VERCEL === "1") {
  // 🟡 على Vercel: التخزين في الذاكرة (مطلوب عند رفع للـ cloud)
  storage = multer.memoryStorage();
} else {
  // 🟢 محليًا: نخزن على القرص داخل مجلد "uploads"
  const uploadPath = "uploads";

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
}

// ✅ الميدل وير النهائي
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // حد أقصى 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .png, .jpg files are allowed!"));
    }
  },
});

export default upload;
