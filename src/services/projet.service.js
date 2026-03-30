// src/services/projet.service.js
const repo = require('../repositories/projet.repo');
const HttpError = require('../utils/httpError');

const getAll = () => repo.findAll();

const getById = async (id) => {
  const projet = await repo.findById(id);
  if (!projet) throw new HttpError(404, `Projet #${id} introuvable`);
  return projet;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  const projet = await getById(id);

  // Règle : un projet TERMINE doit avoir une dateFin
  if (data.statut === 'TERMINE') {
    const dateFin = data.dateFin ?? projet.dateFin;
    if (!dateFin) {
      throw new HttpError(400, 'Un projet ne peut pas passer à TERMINÉ sans date de fin');
    }
  }

  // Cohérence dateDebut / dateFin après mise à jour
  const dateDebut = data.dateDebut ?? projet.dateDebut;
  const dateFin = data.dateFin !== undefined ? data.dateFin : projet.dateFin;
  if (dateFin && dateFin < dateDebut) {
    throw new HttpError(400, 'La date de fin doit être >= date de début');
  }

  return repo.update(id, data);
};

const remove = async (id) => {
  await getById(id);
  const nbAffectations = await repo.countAffectations(id);
  if (nbAffectations > 0) {
    throw new HttpError(
      409,
      `Impossible de supprimer ce projet : il possède ${nbAffectations} affectation(s).`
    );
  }
  return repo.remove(id);
};

module.exports = { getAll, getById, create, update, remove };
