// src/controllers/projet.controller.js
const service = require('../services/projet.service');
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

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    created(res, data, 'Projet créé avec succès');
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    success(res, data, 'Projet mis à jour');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    success(res, null, 'Projet supprimé');
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
