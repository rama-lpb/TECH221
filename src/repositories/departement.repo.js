// src/repositories/departement.repo.js
const prisma = require('../config/db');

const findAll = (includeArchived = false) => {
  return prisma.departement.findMany({
    where: {
      ...(includeArchived ? {} : { archive: false }),
      sousDepartement: null,
    },
    orderBy: { code: 'asc' },
  });
};

const findById = (id) => {
  return prisma.departement.findUnique({ where: { id } });
};

const findRootByCode = (code) => {
  return prisma.departement.findFirst({ where: { code, sousDepartement: null } });
};

const findByCodeAndSousDepartement = (code, sousDepartement) => {
  return prisma.departement.findFirst({
    where: {
      code,
      sousDepartement,
    },
  });
};

const findSousDepartementsByCode = (code, includeArchived = false) => {
  return prisma.departement.findMany({
    where: {
      code,
      ...(includeArchived ? {} : { archive: false }),
      sousDepartement: { not: null },
    },
    orderBy: [{ sousDepartement: 'asc' }, { id: 'asc' }],
  });
};

const findSousDepartementsByCodes = (codes, includeArchived = false) => {
  return prisma.departement.findMany({
    where: {
      code: { in: codes },
      ...(includeArchived ? {} : { archive: false }),
      sousDepartement: { not: null },
    },
    orderBy: [{ code: 'asc' }, { sousDepartement: 'asc' }, { id: 'asc' }],
  });
};

const countSousDepartementsByCode = (code, includeArchived = true) => {
  return prisma.departement.count({
    where: {
      code,
      ...(includeArchived ? {} : { archive: false }),
      sousDepartement: { not: null },
    },
  });
};

const create = (data) => {
  return prisma.departement.create({ data });
};

const update = (id, data) => {
  return prisma.departement.update({ where: { id }, data });
};

const updateByCode = (code, data) => {
  return prisma.departement.updateMany({ where: { code }, data });
};

const remove = (id) => {
  return prisma.departement.delete({ where: { id } });
};

const countEmployes = (id) => {
  return prisma.employe.count({ where: { departementId: id } });
};

module.exports = {
  findAll,
  findById,
  findRootByCode,
  findByCodeAndSousDepartement,
  findSousDepartementsByCode,
  findSousDepartementsByCodes,
  countSousDepartementsByCode,
  create,
  update,
  updateByCode,
  remove,
  countEmployes,
};
