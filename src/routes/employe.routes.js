// src/routes/employe.routes.js
const { Router } = require('express');
const ctrl = require('../controllers/employe.controller');
const validate = require('../middlewares/validate');
const { handlePhotoUpload } = require('../middlewares/upload.middleware');
const { idParamSchema } = require('../validations/common.schema');
const { createEmployeSchema, updateEmployeSchema } = require('../validations/employe.schema');

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
router.post('/', validate(createEmployeSchema), ctrl.create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateEmployeSchema), ctrl.update);
router.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);

// Route pour uploader la photo d'un employé
router.post('/:id/photo', validate(idParamSchema, 'params'), handlePhotoUpload, ctrl.uploadPhoto);

module.exports = router;
