// src/routes/index.js
const { Router } = require('express');
const departementRoutes = require('./departement.routes');
const employeRoutes = require('./employe.routes');
const projetRoutes = require('./projet.routes');
const affectationRoutes = require('./affectation.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

router.use('/departements', departementRoutes);
router.use('/employes', employeRoutes);
router.use('/projets', projetRoutes);
router.use('/affectations', affectationRoutes);

module.exports = router;
