// src/middlewares/errorHandler.js
const HttpError = require('../utils/httpError');
const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`, err.stack);

  if (err instanceof HttpError) {
    return error(res, err.message, err.statusCode, err.details);
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const fields = err.meta?.target?.join(', ') || 'champ';
    return error(res, `Violation d'unicité sur : ${fields}`, 409);
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return error(res, 'Ressource introuvable', 404);
  }

  // Prisma foreign key constraint
  if (err.code === 'P2003') {
    return error(res, 'Référence invalide : la ressource liée est introuvable', 400);
  }

  // Zod validation error (passthrough depuis validate.js)
  if (err.name === 'ZodError') {
    return error(res, 'Données invalides', 422, err.errors);
  }

  return error(res, 'Erreur interne du serveur', 500);
};

module.exports = errorHandler;
