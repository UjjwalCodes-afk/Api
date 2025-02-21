// import multer, { StorageEngine } from 'multer';
// import path from 'path';

// // Set up Multer storage engine
// const storage: StorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif|webp/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Error: Images Only!'));
//     }
//   },
// });

// export { upload };

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name:  "dbwhhrlja",
    api_key: "976246536984313",
    api_secret:  "BJOL3TwEbjgSTpTpxjHXPWVXvFk"
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
      return {
          folder: "uploads", // Cloudinary folder
          format: file.mimetype.split("/")[1], // Use the correct file format
          public_id: `product_${Date.now()}` // Unique file name
      };
  }
});

// Initialize Multer
const upload = multer({ storage });

export { upload };
