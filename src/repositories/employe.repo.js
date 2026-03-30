// src/repositories/employe.repo.js
const prisma = require('../config/db');

const findAll = () => {
  return prisma.employe.findMany({
    include: { departement: true },
    orderBy: { nom: 'asc' },
  });
};

const findById = (id) => {
  return prisma.employe.findUnique({
    where: { id },
    include: { departement: true },
  });
};

const findByEmail = (email) => {
  return prisma.employe.findUnique({ where: { email } });
};

const findByDepartement = (departementId) => {
  return prisma.employe.findMany({ where: { departementId } });
};

const create = (data) => {
  return prisma.employe.create({ data, include: { departement: true } });
};

const update = (id, data) => {
  return prisma.employe.update({ where: { id }, data, include: { departement: true } });
};

const remove = (id) => {
  return prisma.employe.delete({ where: { id } });
};

const countAffectations = (id) => {
  return prisma.affectation.count({ where: { employeId: id } });
};

// Trouver le dernier matricule pour générer le nouveau
const findLastMatricule = () => {
  return prisma.employe.findFirst({
    orderBy: { matricule: 'desc' },
    select: { matricule: true },
  });
};

module.exports = { findAll, findById, findByEmail, findByDepartement, create, update, remove, countAffectations, findLastMatricule };
