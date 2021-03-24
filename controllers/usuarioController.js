const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator')

exports.crearUsuario = async (req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() })
    }

    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email })
        if (usuario) {
            res.status(400).json({ msg: 'El usuario ya existe' });
        }
        usuario = Usuario(req.body);
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        await usuario.save();
        res.status(200).json({ msg: 'Usuario creado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Error al crear el usuario' });
    }
}