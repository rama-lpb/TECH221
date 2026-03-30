// src/routes/projet.routes.js
const { Router } = require('express');
const ctrl = require('../controllers/projet.controller');
const affCtrl = require('../controllers/affectation.controller');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../validations/common.schema');
const { createProjetSchema, updateProjetSchema } = require('../validations/projet.schema');

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
router.get('/:projetId/affectations', affCtrl.getByProjet);
router.post('/', validate(createProjetSchema), ctrl.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateProjetSchema), ctrl.update);
router.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);

module.exports = router;
