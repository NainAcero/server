const Usuario = require('../models/usuario');

const usuarioConectado = async ( user = '' ) => {

    const usuario = await Usuario.findById( user.uid );
    usuario.online = true;
    await usuario.save();
    return usuario;
}

const usuarioDesconectado = async ( user = '' ) => {

    const usuario = await Usuario.findById( user.uid );
    usuario.online = false;
    await usuario.save();
    return usuario;
}


module.exports = {
    usuarioConectado,
    usuarioDesconectado
}