const Usuario = require('../models/Proyecto');
const { validationResult } = require('express-validator');
const Proyecto = require('../models/Proyecto');


// Obtiene que usuario esta autenticado
exports.crearProyecto = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        const proyecto = new Proyecto(req.body);
        proyecto.creador = req.usuario.id;
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.status(200).json(proyectos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');

    }
}

exports.actualizarProyecto = async (req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    const idProyecto = req.params.id;

    try {
        const proyecto = await Proyecto.findById(idProyecto);
        // si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        //verificar que sea el usuario creador
        if (proyecto.credor.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }
        proyecto = await Proyecto.findByIdAndUpdate(idProyecto, { nombre: req.body.nombre }, { new: true });

        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarProyecto = async (req, res) => {
    try {
        // revisar el ID 
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Eliminar el Proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado ' })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}