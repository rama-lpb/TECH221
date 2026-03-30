// src/services/employe.service.js
const repo = require('../repositories/employe.repo');
const deptRepo = require('../repositories/departement.repo');
const cloudinary = require('../config/cloudinary.config');
const HttpError = require('../utils/httpError');

// Générer le matricule auto-généré format EMP-AAAA-XXXX
const generateMatricule = async () => {
  const currentYear = new Date().getFullYear();
  const lastEmploye = await repo.findLastMatricule();
  
  let nextNumber = 1;
  
  if (lastEmploye && lastEmploye.matricule) {
    // Extraire l'année et le numéro du dernier matricule
    const lastMatricule = lastEmploye.matricule;
    const parts = lastMatricule.split('-');
    
    if (parts.length === 3) {
      const lastYear = parseInt(parts[1], 10);
      const lastNumber = parseInt(parts[2], 10);
      
      // Si l'année est la même, incrémenter le numéro
      if (lastYear === currentYear) {
        nextNumber = lastNumber + 1;
      }
      // Si l'année est différente, recommencer à 1
    }
  }
  
  // Formater le numéro avec des zéros (0001)
  const formattedNumber = nextNumber.toString().padStart(4, '0');
  return `EMP-${currentYear}-${formattedNumber}`;
};

const getAll = () => repo.findAll();

const getById = async (id) => {
  const emp = await repo.findById(id);
  if (!emp) throw new HttpError(404, `Employé #${id} introuvable`);
  return emp;
};

const create = async (data) => {
  // Vérifier unicité email
  const existingEmail = await repo.findByEmail(data.email);
  if (existingEmail) throw new HttpError(409, `L'email "${data.email}" est déjà utilisé`);

  // Vérifier existence du département
  const dept = await deptRepo.findById(data.departementId);
  if (!dept) throw new HttpError(400, `Le département #${data.departementId} n'existe pas`);
  if (dept.archive) throw new HttpError(400, `Le département #${data.departementId} est archivé`);

  // Générer le matricule auto-généré
  const matricule = await generateMatricule();

  return repo.create({ ...data, matricule });
};

const update = async (id, data) => {
  await getById(id);

  if (data.email) {
    const existing = await repo.findByEmail(data.email);
    if (existing && existing.id !== id) {
      throw new HttpError(409, `L'email "${data.email}" est déjà utilisé`);
    }
  }

  if (data.departementId) {
    const dept = await deptRepo.findById(data.departementId);
    if (!dept) throw new HttpError(400, `Le département #${data.departementId} n'existe pas`);
    if (dept.archive) throw new HttpError(400, `Le département #${data.departementId} est archivé`);
  }

  return repo.update(id, data);
};

// Supprimer la photo de Cloudinary
const deleteCloudinaryPhoto = async (photoUrl) => {
  if (!photoUrl) return;
  
  try {
    // Extraire l'public_id de l'URL Cloudinary
    const urlParts = photoUrl.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const fileName = fileNameWithExtension.split('.')[0];
    const publicId = `employes/${fileName}`;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Log l'erreur mais ne pas bloquer la suppression de l'employé
    console.error('Erreur lors de la suppression de la photo Cloudinary:', error.message);
  }
};

const remove = async (id) => {
  const emp = await getById(id);
  
  const nbAffectations = await repo.countAffectations(id);
  if (nbAffectations > 0) {
    throw new HttpError(
      409,
      `Impossible de supprimer cet employé : il possède ${nbAffectations} affectation(s) active(s).`
    );
  }
  
  // Supprimer la photo de Cloudinary si elle existe
  if (emp.photoUrl) {
    await deleteCloudinaryPhoto(emp.photoUrl);
  }
  
  return repo.remove(id);
};

module.exports = { getAll, getById, create, update, remove };
