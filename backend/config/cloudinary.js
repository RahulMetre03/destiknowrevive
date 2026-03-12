import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ---------- Post image upload (up to 10 images) ----------
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `destiknowrevive/posts/${req.user._id}`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1080, height: 1080, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
    public_id: `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '')}`,
  }),
});

export const uploadPostImages = multer({
  storage: postStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per image
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only jpeg/png/webp images are allowed'), false);
    }
    cb(null, true);
  },
}).array('images', 10);

// ---------- Avatar upload (single image) ----------
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, _file) => ({
    folder: `destiknowrevive/avatars`,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
    public_id: `avatar_${req.user._id}_${Date.now()}`,
  }),
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only jpeg/png/webp allowed'), false);
    }
    cb(null, true);
  },
}).single('avatar');

export default cloudinary;
