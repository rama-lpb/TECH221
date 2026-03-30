// src/services/affectation.service.js
const repo = require('../repositories/affectation.repo');
const employeRepo = require('../repositories/employe.repo');
const projetRepo = require('../repositories/projet.repo');
const HttpError = require('../utils/httpError');

const STATUTS_BLOQUES = ['TERMINE', 'ANNULE'];

const getAll = () => repo.findAll();

const getById = async (id) => {
  const aff = await repo.findById(id);
  if (!aff) throw new HttpError(404, `Affectation #${id} introuvable`);
  return aff;
};

const getByProjet = (projetId) => repo.findByProjet(projetId);

const getByEmploye = (employeId) => repo.findByEmploye(employeId);

const create = async ({ employeId, projetId, role, dateAffectation }) => {
  // Vérifier existence employé
  const employe = await employeRepo.findById(employeId);
  if (!employe) throw new HttpError(404, `Employé #${employeId} introuvable`);

  // Vérifier existence projet
  const projet = await projetRepo.findById(projetId);
  if (!projet) throw new HttpError(404, `Projet #${projetId} introuvable`);

  // Vérifier statut projet
  if (STATUTS_BLOQUES.includes(projet.statut)) {
    throw new HttpError(
      400,
      `Impossible d'affecter un employé à un projet au statut "${projet.statut}"`
    );
  }

  // Vérifier doublon
  const doublon = await repo.findByEmployeAndProjet(employeId, projetId);
  if (doublon) {
    throw new HttpError(
      409,
      `L'employé #${employeId} est déjà affecté au projet #${projetId}`
    );
  }

  // Vérifier dateAffectation >= dateDebut
  if (dateAffectation < projet.dateDebut) {
    throw new HttpError(
      400,
      `La date d'affectation (${dateAffectation.toISOString()}) doit être >= à la date de début du projet (${projet.dateDebut.toISOString()})`
    );
  }

  return repo.create({ employeId, projetId, role, dateAffectation });
};

const update = async (id, data) => {
  await getById(id);
  return repo.update(id, data);
};

const remove = async (id) => {
  await getById(id);
  return repo.remove(id);
};

module.exports = { getAll, getById, getByProjet, getByEmploye, create, update, remove };
