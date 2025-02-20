// import multer, { StorageEngine, FileFilterCallback } from 'multer';
// import path from 'path';
// import { Request } from 'express';
// import fs from 'fs';

// // Ensure that the 'Uploads' directory exists
// const ensureUploadDirectoryExists = () => {
//   const directoryPath = 'Uploads';
//   if (!fs.existsSync(directoryPath)) {
//     fs.mkdirSync(directoryPath, { recursive: true });
//   }
// };

// // Define storage configuration for Multer
// const storage: StorageEngine = multer.diskStorage({
//   destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//     // Ensure 'Uploads' directory exists before storing the file
//     ensureUploadDirectoryExists();
//     // Folder to store uploaded images
//     cb(null, 'Uploads/');
//   },
//   filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//     // Set the filename as the product name with a timestamp to avoid name conflicts
//     const ext = path.extname(file.originalname);
//     const uniqueName = `product-${Date.now()}${ext}`;
//     cb(null,uniqueName);
//   }
// });

// // File filter to allow only image files (jpg, jpeg, png, gif, webp)
// const fileFilter: FileFilterCallback = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);  // Accept the file
//   } else {
//     cb(new Error('Only image files are allowed'), false);  // Reject the file with an error
//   }
// };

// // Setup Multer with storage, file filter, and file size limit
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // File size limit: 5MB
// });

// export default upload;


import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

export default upload;
