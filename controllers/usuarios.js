const { response } = require("express");
const Usuario = require('../models/usuario');

const getUsuarios = async ( req, res = response ) => {

    const desde = Number( req.query.desde ) || 0;

    const [ usuarios, total ] = await Promise.all([
        Usuario.find({ _id: { $ne: req.uid }, role : 'USER_ROLE' }).sort({$natural:-1}).limit(4).skip(desde).lean().exec(),
        Usuario.find({ role : 'USER_ROLE' })
      ]);

    res.json ({
        ok: true, 
        usuarios,
        total: total.length,
        skip: desde
    });
}

const buscarUsuario = async ( req, res = response ) => {

    const nombre = req.query.nombre;
    
    const usuarios = await Usuario.find({
        $or: [
            { nombre: { $regex: `.*${ nombre }.*`, $options: "i" } },
            { telefono: { $regex: `.*${ nombre }.*`, $options: "i" } },
            { email: { $regex: `.*${ nombre }.*`, $options: "i" } }], 
        role: 'USER_ROLE'
    });
    
    res.json ({
        ok: true, 
        usuarios
    });
}

const getUsuario = async ( req, res = response ) => {

    const uid = req.usuario.uid;
    
    const usuario = await Usuario.findById( uid );

    res.json ({
        ok: true, 
        usuario
    });
}

module.exports = {
    getUsuarios,
    getUsuario,
    buscarUsuario
}