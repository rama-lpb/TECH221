// src/repositories/affectation.repo.js
const prisma = require('../config/db');

const findAll = () => {
  return prisma.affectation.findMany({
    include: { employe: true, projet: true },
    orderBy: { createdAt: 'desc' },
  });
};

const findById = (id) => {
  return prisma.affectation.findUnique({
    where: { id },
    include: { employe: true, projet: true },
  });
};

const findByEmployeAndProjet = (employeId, projetId) => {
  return prisma.affectation.findUnique({
    where: { employeId_projetId: { employeId, projetId } },
  });
};

const findByProjet = (projetId) => {
  return prisma.affectation.findMany({
    where: { projetId },
    include: { employe: true },
  });
};

const findByEmploye = (employeId) => {
  return prisma.affectation.findMany({
    where: { employeId },
    include: { projet: true },
  });
};

const create = (data) => {
  return prisma.affectation.create({
    data,
    include: { employe: true, projet: true },
  });
};

const update = (id, data) => {
  return prisma.affectation.update({
    where: { id },
    data,
    include: { employe: true, projet: true },
  });
};

const remove = (id) => {
  return prisma.affectation.delete({ where: { id } });
};

module.exports = { findAll, findById, findByEmployeAndProjet, findByProjet, findByEmploye, create, update, remove };
