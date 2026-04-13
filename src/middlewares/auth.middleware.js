const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth.config');
const repo = require('../repositories/auth.repo');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Token non fourni');
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await repo.findUserById(decoded.id);
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Token invalide';
      error.statusCode = 401;
    }
    if (error.name === 'TokenExpiredError') {
      error.message = 'Token expiré';
      error.statusCode = 401;
    }
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Non autenticué');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error('Accès refusé');
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};