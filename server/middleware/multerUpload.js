// server/middleware/multerUpload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder;
    const userId = req.user ? req.user._id : 'guest'; // Get userId if available

    if (file.fieldname === 'profilePicture') {
      folder = 'sdg-app/profile-pictures';
    } else if (file.fieldname === 'newsImage') { // Handle news images
      folder = 'sdg-app/news-images';
    } else if (file.fieldname === 'sdgImage') { // For SDG course images
      folder = 'sdg-app/sdg-images';
    } else {
      folder = 'sdg-app/uploads';
    }
    
    const public_id = `${file.fieldname.replace(/\s+/g, '_')}-${userId}-${Date.now()}`;

    return {
      folder: folder,
      public_id: public_id,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      // transformation: [{ width: 800, crop: 'limit' }] // Optional transformation for news images
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

export default upload;