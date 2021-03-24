const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

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

        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if (error) throw error;
            // Mensaje de confirmación
            res.json({ token });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Error al crear el usuario' });
    }
}