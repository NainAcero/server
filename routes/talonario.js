const { Router } = require('express');
const { getTalonarios_uid, newTalonario, infoTalonario, getTalonarioByIdUser } = require('../controllers/talonario');
const { validarJWT, validarJWT_ADMIN } = require('../middlewares/validar-jwt');

const router = Router();

/**
 * api/talonario
 */

router.get('/', validarJWT, getTalonarios_uid);
router.get('/admin', validarJWT_ADMIN, getTalonarioByIdUser);
router.get('/info', infoTalonario);
router.post('/new', validarJWT_ADMIN, newTalonario);

module.exports = router;
