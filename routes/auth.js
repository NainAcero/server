const { check } = require('express-validator');

const { Router } = require('express');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarJWT_ADMIN } = require('../middlewares/validar-jwt');

const router = Router();

/**
 * api/login
 */

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('telefono', 'El Teléfono es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    validarCampos
] ,crearUsuario);

router.post('/', [
    check('telefono', 'El Teléfono es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    validarCampos
] ,loginUsuario);

router.get('/renew', validarJWT, renewToken);

module.exports = router;