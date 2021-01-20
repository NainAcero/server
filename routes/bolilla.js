const { Router } = require('express');
const { getBolillas } = require('../controllers/bolilla');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

/**
 * api/bolilla
 */

router.get('/', validarJWT, getBolillas);
module.exports = router;