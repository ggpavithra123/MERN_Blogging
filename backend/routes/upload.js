import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/images")); // uploaded files folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // unique name
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json("No file uploaded");

  // Return uploaded filename
  res.status(200).json({ filename: req.file.filename });
});

export default router;