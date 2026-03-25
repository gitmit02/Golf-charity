const cloudinary = require('cloudinary').v2;

const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  console.log('✅ Cloudinary Configured for Image Uploads');
};

module.exports = configCloudinary;