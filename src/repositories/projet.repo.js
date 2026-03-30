// src/repositories/projet.repo.js
const prisma = require('../config/db');

const findAll = () => {
  return prisma.projet.findMany({ orderBy: { createdAt: 'desc' } });
};

const findById = (id) => {
  return prisma.projet.findUnique({ where: { id } });
};

const create = (data) => {
  return prisma.projet.create({ data });
};

const update = (id, data) => {
  return prisma.projet.update({ where: { id }, data });
};

const remove = (id) => {
  return prisma.projet.delete({ where: { id } });
};

const countAffectations = (id) => {
  return prisma.affectation.count({ where: { projetId: id } });
};

module.exports = { findAll, findById, create, update, remove, countAffectations };
