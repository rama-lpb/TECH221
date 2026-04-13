const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../utils/httpError');
const repo = require('../repositories/auth.repo');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/auth.config');

const register = async ({ email, password, nom, prenom, role = 'USER' }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await repo.createUser({
    email,
    password: hashedPassword,
    nom,
    prenom,
    role,
  });

  return {
    id: user.id,
    email: user.email,
    nom: user.nom,
    prenom: user.prenom,
    role: user.role,
    message: 'Compte créé avec succès',
  };
};

const login = async ({ email, password }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new HttpError(401, 'Identifiants incorrects');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Identifiants incorrects');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
    },
    token,
    refreshToken,
  };
};

const getProfile = async (userId) => {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw new HttpError(404, 'Utilisateur non trouvé');
  }
  return user;
};

module.exports = {
  register,
  login,
  getProfile,
};