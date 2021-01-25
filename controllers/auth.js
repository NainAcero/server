const { response } = require("express");

const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response ) => {

    const { email, telefono } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ $or: [ { email }, { telefono } ] } );

        if( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ó Teléfono ya está registrado'
            });
        }

        req.body.role = 'USER_ROLE';

        const usuario = new Usuario( req.body );

        await usuario.save();

        const token = await generarJWT( usuario , usuario.type);
    
        res.json({
            ok: true,
            msg: 'Crear Usuario',
            usuario,
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


const loginUsuario = async (req, res = response ) => {

    const { email, telefono } = req.body;
    
    try {
        
        const usuarioDB = await Usuario.findOne({ email , telefono });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email ó Teléfono no encontrado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuarioDB );
        
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renewToken = async ( req, res = response ) => {

    const uid = req.usuario._id;

    const usuario = await Usuario.findById( uid );

    // Generar el JWT
    const token = await generarJWT( usuario );

    res.json({
        ok: true,
        usuario,
        token
    });

}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}