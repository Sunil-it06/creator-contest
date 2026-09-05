const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imageDir = path.join(__dirname, "../../uploads/images");
const videoDir = path.join(__dirname, "../../uploads/videos");

fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

// 1. File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm"
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG, WEBP, MP4 and WEBM files are allowed")
    );
  }

  cb(null, true);
};

// 2. Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imageDir);
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, videoDir);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, filename);
  }
});

// 3. Multer Instance
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter
});

module.exports = upload;