const prisma = require('../config/db');

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const createUser = async (data) => {
  return prisma.user.create({
    data,
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};