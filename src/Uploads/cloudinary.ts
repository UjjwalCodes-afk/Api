import { v2 as cloudinary } from 'cloudinary';

// Load environment variables


// Configure Cloudinary
cloudinary.config({
    cloud_name: "dbwhhrlja",
    api_key: "976246536984313",
    api_secret: "BJOL3TwEbjgSTpTpxjHXPWVXvFk"
});

console.log(process.env.CLOUDINARY_API_KEY);
export default cloudinary;
