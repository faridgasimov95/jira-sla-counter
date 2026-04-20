import multer, { FileFilterCallback } from "multer";

/**
 * Multer middleware for handling Excel file uploads.
 * Stores the file in memory as buffer instead of saving it to the disk.
 */
const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .xlsx files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });
