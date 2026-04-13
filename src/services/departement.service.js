// src/services/departement.service.js
const repo = require('../repositories/departement.repo');
const HttpError = require('../utils/httpError');

const withSousDepartements = (departements, sousDepartements) => {
  const byCode = new Map();
  for (const sous of sousDepartements) {
    if (!byCode.has(sous.code)) byCode.set(sous.code, []);
    byCode.get(sous.code).push(sous);
  }

  return departements.map((d) => ({
    ...d,
    sousDepartements: byCode.get(d.code) || [],
  }));
};

const getAll = async (includeArchived) => {
  const departements = await repo.findAll(includeArchived);
  const codes = departements.map((d) => d.code);
  if (codes.length === 0) return [];

  const sousDepartements = await repo.findSousDepartementsByCodes(codes, includeArchived);
  return withSousDepartements(departements, sousDepartements);
};

const getById = async (id) => {
  const dept = await repo.findById(id);
  if (!dept || dept.sousDepartement !== null) throw new HttpError(404, `Département #${id} introuvable`);
  const sousDepartements = await repo.findSousDepartementsByCode(dept.code, false);
  return { ...dept, sousDepartements };
};

const create = async ({ code, libelle }) => {
  const existing = await repo.findByCodeAndSousDepartement(code, null);
  if (existing) throw new HttpError(409, `Le code département "${code}" est déjà utilisé`);
  return repo.create({ code, sousDepartement: null, libelle });
};

const update = async (id, data) => {
  const dept = await getById(id);

  if (data.code) {
    const existing = await repo.findByCodeAndSousDepartement(data.code, null);
    if (existing && existing.id !== id) throw new HttpError(409, `Le code département "${data.code}" est déjà utilisé`);
  }

  const updated = await repo.update(id, data);

  // Maintenir la cohérence des sous-départements (mêmes code/libelle que le département racine)
  const nextCode = updated.code;
  const nextLibelle = updated.libelle;
  if (nextCode !== dept.code) {
    await repo.updateByCode(dept.code, { code: nextCode });
  }
  if (nextLibelle !== dept.libelle) {
    await repo.updateByCode(nextCode, { libelle: nextLibelle });
  }

  return updated;
};

const archive = async (id) => {
  const dept = await getById(id);
  await repo.updateByCode(dept.code, { archive: true });
  return repo.findById(id);
};

const remove = async (id) => {
  const dept = await getById(id);
  const nbEmployes = await repo.countEmployes(id);
  if (nbEmployes > 0) {
    throw new HttpError(
      409,
      `Impossible de supprimer ce département : il contient encore ${nbEmployes} employé(s). Déplacez-les ou archivez le département.`
    );
  }
  const nbSousDepartements = await repo.countSousDepartementsByCode(dept.code, true);
  if (nbSousDepartements > 0) {
    throw new HttpError(
      409,
      `Impossible de supprimer ce département : il contient encore ${nbSousDepartements} sous-département(s). Supprimez-les ou archivez le département.`
    );
  }
  return repo.remove(id);
};

module.exports = { getAll, getById, create, update, archive, remove };
