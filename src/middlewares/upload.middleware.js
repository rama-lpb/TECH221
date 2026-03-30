// src/middlewares/upload.middleware.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary.config');
const { promisify } = require('util');
const HttpError = require('../utils/httpError');

// Configuration du stockage mémoire pour Multer
const storage = multer.memoryStorage();

// Filter pour accepter uniquement les images jpeg et png
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new HttpError(400, 'Type de fichier non autorisé. Formats acceptés: jpeg, png'), false);
  }
};

// Configuration Multer: taille max 2Mo et filter
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 Mo
  },
  fileFilter,
});

// Fonction pour uploader sur Cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'employes',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    uploadStream.end(file.buffer);
  });
};

// Middleware pour gérer l'upload de photo
const handlePhotoUpload = async (req, res, next) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      if (err instanceof HttpError) {
        return next(err);
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new HttpError(400, 'La taille du fichier ne doit pas dépasser 2 Mo'));
      }
      return next(new HttpError(400, 'Erreur lors de l\'upload du fichier'));
    }
    
    // Si pas de fichier, passer au middleware suivant
    if (!req.file) {
      return next();
    }
    
    try {
      const result = await uploadToCloudinary(req.file);
      req.body.photoUrl = result.secure_url;
      next();
    } catch (error) {
      next(new HttpError(500, 'Erreur lors de l\'upload vers Cloudinary'));
    }
  });
};

module.exports = { upload, handlePhotoUpload };
