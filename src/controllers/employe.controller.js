// src/controllers/employe.controller.js
const service = require('../services/employe.service');
const { success, created } = require('../utils/response');
const cloudinary = require('../config/cloudinary.config');

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();
    success(res, data);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    success(res, data);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    created(res, data, 'Employé créé avec succès');
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    success(res, data, 'Employé mis à jour');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    success(res, null, 'Employé supprimé');
  } catch (err) { next(err); }
};

// Upload de la photo de l'employé
const uploadPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Vérifier que l'employé existe
    const employe = await service.getById(id);
    
    // Si pas de photouploadée, retourner une erreur
    if (!req.body.photoUrl) {
      return next(new Error('Aucune photo fournie'));
    }
    
    // Si l'employé avait déjà une photo, la supprimer de Cloudinary
    if (employe.photoUrl) {
      try {
        const urlParts = employe.photoUrl.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExtension.split('.')[0];
        const publicId = `employes/${fileName}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'ancienne photo:', err.message);
      }
    }
    
    // Mettre à jour avec la nouvelle URL de photo
    const updatedEmploye = await service.update(id, { photoUrl: req.body.photoUrl });
    success(res, updatedEmploye, 'Photo de l\'employé mise à jour');
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, uploadPhoto };
