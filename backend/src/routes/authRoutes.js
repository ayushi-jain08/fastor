const router = require('express').Router();
const validate = require('../middleware/validate');
const schema = require('../validations/auth.validation');
const { register, login } = require('../controllers/authController');

router.post('/register', validate(schema.register), register);
router.post('/login', validate(schema.login), login);

module.exports = router;
