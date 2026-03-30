// src/services/departement.service.js
const repo = require('../repositories/departement.repo');
const HttpError = require('../utils/httpError');

const getAll = (includeArchived) => repo.findAll(includeArchived);

const getById = async (id) => {
  const dept = await repo.findById(id);
  if (!dept) throw new HttpError(404, `Département #${id} introuvable`);
  return dept;
};

const create = async ({ code, sousDepartement, libelle }) => {
  const existing = await repo.findByCodeAndSousDepartement(code, sousDepartement);
  if (existing) throw new HttpError(409, `Le code département "${code}" avec sous-département "${sousDepartement || 'null'}" est déjà utilisé`);
  return repo.create({ code, sousDepartement, libelle });
};

const update = async (id, data) => {
  await getById(id);
  if (data.code || data.sousDepartement !== undefined) {
    const code = data.code || (await repo.findById(id)).code;
    const sousDepartement = data.sousDepartement !== undefined ? data.sousDepartement : (await repo.findById(id)).sousDepartement;
    const existing = await repo.findByCodeAndSousDepartement(code, sousDepartement);
    if (existing && existing.id !== id) {
      throw new HttpError(409, `Le code département "${code}" avec sous-département "${sousDepartement || 'null'}" est déjà utilisé`);
    }
  }
  return repo.update(id, data);
};

const archive = async (id) => {
  await getById(id);
  return repo.update(id, { archive: true });
};

const remove = async (id) => {
  await getById(id);
  const nbEmployes = await repo.countEmployes(id);
  if (nbEmployes > 0) {
    throw new HttpError(
      409,
      `Impossible de supprimer ce département : il contient encore ${nbEmployes} employé(s). Déplacez-les ou archivez le département.`
    );
  }
  return repo.remove(id);
};

module.exports = { getAll, getById, create, update, archive, remove };
