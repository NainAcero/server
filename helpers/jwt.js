const jwt = require('jsonwebtoken');

const generarJWT = ( usuario ) => {

    return new Promise( (resolve, reject) => {

        const payload = { usuario };

        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, (err, token) => {
            if( err ){
                reject('No se pudo crear el JWT');
            }else{
                resolve(token);
            }
        });

    });

}

const comprobarJWT = ( token = '' ) => {

    try {

        const { usuario } = jwt.verify( token, process.env.JWT_KEY );
        return [ true, usuario ];
    } catch( error ) {
        return [ false, null ];
    }

}

module.exports = {
    generarJWT,
    comprobarJWT
}
