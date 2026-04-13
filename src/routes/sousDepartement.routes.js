// src/routes/sousDepartement.routes.js
const { Router } = require('express');
const ctrl = require('../controllers/sousDepartement.controller');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../validations/common.schema');
const { updateSousDepartementSchema } = require('../validations/sousDepartement.schema');

const router = Router();

router.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateSousDepartementSchema), ctrl.update);
router.patch('/:id/archive', validate(idParamSchema, 'params'), ctrl.archive);
router.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);

module.exports = router;

