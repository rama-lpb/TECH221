// src/repositories/departement.repo.js
const prisma = require('../config/db');

const findAll = (includeArchived = false) => {
  return prisma.departement.findMany({
    where: includeArchived ? {} : { archive: false },
    orderBy: { code: 'asc' },
  });
};

const findById = (id) => {
  return prisma.departement.findUnique({ where: { id } });
};

const findByCode = (code) => {
  return prisma.departement.findUnique({ where: { code } });
};

const findByCodeAndSousDepartement = (code, sousDepartement) => {
  return prisma.departement.findFirst({
    where: {
      code,
      sousDepartement,
    },
  });
};

const create = (data) => {
  return prisma.departement.create({ data });
};

const update = (id, data) => {
  return prisma.departement.update({ where: { id }, data });
};

const remove = (id) => {
  return prisma.departement.delete({ where: { id } });
};

const countEmployes = (id) => {
  return prisma.employe.count({ where: { departementId: id } });
};

module.exports = { findAll, findById, findByCode, findByCodeAndSousDepartement, create, update, remove, countEmployes };
