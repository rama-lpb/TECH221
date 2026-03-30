// src/controllers/affectation.controller.js
const service = require('../services/affectation.service');
const { success, created } = require('../utils/response');

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

const getByProjet = async (req, res, next) => {
  try {
    const data = await service.getByProjet(req.params.projetId);
    success(res, data);
  } catch (err) { next(err); }
};

const getByEmploye = async (req, res, next) => {
  try {
    const data = await service.getByEmploye(req.params.employeId);
    success(res, data);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    created(res, data, 'Affectation créée avec succès');
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    success(res, data, 'Affectation mise à jour');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    success(res, null, 'Affectation supprimée');
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, getByProjet, getByEmploye, create, update, remove };
