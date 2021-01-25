const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado } = require('../controllers/socket');
const { actualizarTalonario } = require('../controllers/talonario');
const { guardarBolilla } = require('../controllers/bolilla');
const { sacar_numero } = require('../controllers/bingo');

// Mensajes de Sockets
io.on('connection', client => {
    
    console.log('Cliente conectado');

    const [ valido, usuario ] = comprobarJWT( client.handshake.query.token );

    // verificar autenticación
    if( !valido ) { return client.disconnect(); }

    // usuarioConectado(usuario);

    client.on('disconnect', ( payload ) => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });

    client.on('bingo_emit', ( payload ) => {
        console.log('usuario', payload);
        io.emit( 'bingo_response', payload );
    });

    client.on('sacar_numero', ( numero ) => {

        console.log('BINGO ----> ', numero );
        io.emit( 'obtener_numero', numero );

        actualizarTalonario(numero);
        guardarBolilla(numero);
        
    });

});
