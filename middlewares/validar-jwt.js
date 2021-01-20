const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    let token = req.headers['authorization'];

    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    } 
    
    token = token.replace('Bearer ', '');
    
    try{

        const { usuario } = jwt.verify( token , process.env.JWT_KEY);
        req.usuario = usuario;

        next();

    } catch( error ){
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

const validarJWT_ADMIN = (req, res, next) => {

    let token = req.headers['authorization'];
    let ts = Date.now();

    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    } 

    token = token.replace('Bearer ', '');
    
    try{

        const { usuario } = jwt.verify( token , process.env.JWT_KEY);
        req.usuario = usuario;

        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
    
        // prints date & time in YYYY-MM-DD format
        console.log(year + "-" + month + "-" + date);
    
        console.log(usuario.nombre + ' ---- ' + usuario.role + ' --- ' + Date.now());

        if(usuario.role != "ADMINISTRADOR"){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene Permisos'
            });
        }

        next();

    } catch( error ){
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT,
    validarJWT_ADMIN
}
