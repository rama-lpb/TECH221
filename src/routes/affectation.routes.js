// src/routes/affectation.routes.js
const { Router } = require('express');
const ctrl = require('../controllers/affectation.controller');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../validations/common.schema');
const { createAffectationSchema, updateAffectationSchema } = require('../validations/affectation.schema');

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
router.post('/', validate(createAffectationSchema), ctrl.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateAffectationSchema), ctrl.update);
router.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);

module.exports = router;
