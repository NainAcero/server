const { Router } = require('express');
const { getUsuarios, buscarUsuario  } = require('../controllers/usuarios');
const { validarJWT_ADMIN } = require('../middlewares/validar-jwt');

const router = Router();

/**
 * api/usuarios
 */

router.get('/', validarJWT_ADMIN, getUsuarios);
router.get('/buscar:nombre?', validarJWT_ADMIN, buscarUsuario);

module.exports = router;
