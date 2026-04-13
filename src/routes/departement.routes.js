// src/routes/departement.routes.js
const { Router } = require('express');
const ctrl = require('../controllers/departement.controller');
const sousDeptCtrl = require('../controllers/sousDepartement.controller');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../validations/common.schema');
const { createDepartementSchema, updateDepartementSchema } = require('../validations/departement.schema');
const { createSousDepartementSchema } = require('../validations/sousDepartement.schema');

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
router.get('/:id/sous-departements', validate(idParamSchema, 'params'), sousDeptCtrl.getByDepartement);
router.post('/', validate(createDepartementSchema), ctrl.create);
router.post('/:id/sous-departements', validate(idParamSchema, 'params'), validate(createSousDepartementSchema), sousDeptCtrl.createForDepartement);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateDepartementSchema), ctrl.update);
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateDepartementSchema), ctrl.archive);
router.patch('/:id/archive', validate(idParamSchema, 'params'), ctrl.archive);
router.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);

module.exports = router;
