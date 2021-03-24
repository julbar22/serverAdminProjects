const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
// baseurl = api/usuarios
router.post('/',
    usuarioController.crearUsuario
);

module.exports = router;