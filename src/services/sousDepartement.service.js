// src/services/sousDepartement.service.js
const departementRepo = require('../repositories/departement.repo');
const HttpError = require('../utils/httpError');

const getSousDepartementById = async (id) => {
  const row = await departementRepo.findById(id);
  if (!row || row.sousDepartement === null) throw new HttpError(404, `Sous-département #${id} introuvable`);
  return row;
};

const getByDepartementId = async (departementId, includeArchived = false) => {
  const root = await departementRepo.findById(departementId);
  if (!root || root.sousDepartement !== null) throw new HttpError(404, `Département #${departementId} introuvable`);
  return departementRepo.findSousDepartementsByCode(root.code, includeArchived);
};

const createForDepartement = async (departementId, { sousDepartement }) => {
  const root = await departementRepo.findById(departementId);
  if (!root || root.sousDepartement !== null) throw new HttpError(404, `Département #${departementId} introuvable`);
  if (root.archive) throw new HttpError(400, `Le département #${departementId} est archivé`);

  const existing = await departementRepo.findByCodeAndSousDepartement(root.code, sousDepartement);
  if (existing) {
    throw new HttpError(409, `Le sous-département "${sousDepartement}" existe déjà pour le département "${root.code}"`);
  }

  return departementRepo.create({ code: root.code, libelle: root.libelle, sousDepartement });
};

const update = async (id, data) => {
  const current = await getSousDepartementById(id);

  if (data.sousDepartement) {
    const existing = await departementRepo.findByCodeAndSousDepartement(current.code, data.sousDepartement);
    if (existing && existing.id !== id) {
      throw new HttpError(409, `Le sous-département "${data.sousDepartement}" existe déjà pour le département "${current.code}"`);
    }
  }

  return departementRepo.update(id, data);
};

const archive = async (id) => {
  await getSousDepartementById(id);
  return departementRepo.update(id, { archive: true });
};

const remove = async (id) => {
  await getSousDepartementById(id);
  const nbEmployes = await departementRepo.countEmployes(id);
  if (nbEmployes > 0) {
    throw new HttpError(409, `Impossible de supprimer ce sous-département : il contient encore ${nbEmployes} employé(s).`);
  }
  return departementRepo.remove(id);
};

module.exports = { getSousDepartementById, getByDepartementId, createForDepartement, update, archive, remove };

