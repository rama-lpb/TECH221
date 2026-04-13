const service = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const result = await service.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await service.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await service.getProfile(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};