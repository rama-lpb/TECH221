// src/controllers/sousDepartement.controller.js
const service = require('../services/sousDepartement.service');
const { success, created } = require('../utils/response');

const getByDepartement = async (req, res, next) => {
  try {
    const includeArchived = req.query.archive === 'true';
    const data = await service.getByDepartementId(req.params.id, includeArchived);
    success(res, data);
  } catch (err) { next(err); }
};

const createForDepartement = async (req, res, next) => {
  try {
    const data = await service.createForDepartement(req.params.id, req.body);
    created(res, data, 'Sous-département créé avec succès');
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getSousDepartementById(req.params.id);
    success(res, data);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    success(res, data, 'Sous-département mis à jour');
  } catch (err) { next(err); }
};

const archive = async (req, res, next) => {
  try {
    const data = await service.archive(req.params.id);
    success(res, data, 'Sous-département archivé');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    success(res, null, 'Sous-département supprimé');
  } catch (err) { next(err); }
};

module.exports = { getByDepartement, createForDepartement, getById, update, archive, remove };

