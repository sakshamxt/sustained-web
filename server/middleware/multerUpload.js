// server/middleware/multerUpload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder based on file type or request context if needed
    let folder;
    if (file.fieldname === 'profilePicture') {
      folder = 'sdg-app/profile-pictures';
    } else if (file.fieldname === 'sdgImage') { 
      folder = 'sdg-app/sdg-images';
    } else {
      folder = 'sdg-app/uploads';
    }
    
    // Generate a unique public_id (filename on Cloudinary)
    // For example, fieldname-userid-timestamp
    const userId = req.user ? req.user._id : 'guest';
    const public_id = `${file.fieldname}-${userId}-${Date.now()}`;

    return {
      folder: folder,
      public_id: public_id,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
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