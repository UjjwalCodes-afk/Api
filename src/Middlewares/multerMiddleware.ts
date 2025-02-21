import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Uploads/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "products", // Cloudinary folder
      format: file.mimetype.split("/")[1], // Get the correct file format
      public_id: `product_${Date.now()}` // Unique file name
    };
  }
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage });

export { upload };
