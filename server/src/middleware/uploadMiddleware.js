// src/middleware/uploadMiddleware.js

const multer = require("multer");

/*
  Use memory storage so files are kept in RAM and can be uploaded
  directly to Cloudinary without saving to the local filesystem.
*/
const storage = multer.memoryStorage();

/*
  Allow only image files.
*/
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }

  cb(null, true);
};

/*
  Maximum file size: 5 MB
*/
const limits = {
  fileSize: 5 * 1024 * 1024,
};

/*
  Base multer instance.
*/
const upload = multer({
  storage,
  fileFilter,
  limits,
});

/*
  Upload a single image.
  Usage:
  uploadSingleImage("memberImage")
  uploadSingleImage("completionImage")
*/
const uploadSingleImage = (fieldName) => upload.single(fieldName);

/*
  Upload multiple images for different fields.
  Example:
  uploadMultipleImages([
    { name: "memberImage", maxCount: 1 },
    { name: "completionImage", maxCount: 1 },
  ])
*/
const uploadMultipleImages = (fields) => upload.fields(fields);

/*
  Optional middleware to convert Multer errors into clean JSON responses.
*/
const handleUploadError = (err, req, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must be less than 5 MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message || "File upload failed",
  });
};

module.exports = {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  handleUploadError,
};