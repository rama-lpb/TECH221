// src/routes/index.js
const { Router } = require('express');
const departementRoutes = require('./departement.routes');
const sousDepartementRoutes = require('./sousDepartement.routes');
const employeRoutes = require('./employe.routes');
const projetRoutes = require('./projet.routes');
const affectationRoutes = require('./affectation.routes');
const authRoutes = require('./auth.routes');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Public routes
router.use('/auth', authRoutes);

// Protected routes - require authentication
router.use('/departements', authenticate, departementRoutes);
router.use('/sous-departements', authenticate, sousDepartementRoutes);
router.use('/employes', authenticate, employeRoutes);
router.use('/projets', authenticate, projetRoutes);
router.use('/affectations', authenticate, affectationRoutes);

module.exports = router;
