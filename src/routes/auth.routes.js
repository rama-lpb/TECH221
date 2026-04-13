const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { loginSchema, registerSchema } = require('../validations/auth.schema');

const router = Router();

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);

module.exports = router;