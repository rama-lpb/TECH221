// src/middlewares/notFound.js
const { error } = require('../utils/response');

const notFound = (req, res) => {
  return error(res, `Route introuvable : ${req.method} ${req.originalUrl}`, 404);
};

module.exports = notFound;
