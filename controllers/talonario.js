const { response } = require("express");
const Talonario = require("../models/talonario");
const Usuario = require("../models/usuario");
const nodemailer = require("nodemailer");
var pdf = require('html-pdf');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nain.acero24@gmail.com',
      pass: 'dmtcbkxzjxlvnnph'
    }
  });

const getTalonarios_uid = async ( req, res = response ) => {

    const usuario_id = req.usuario.uid;
    
    const data = await Talonario.find({ usuario_id });
    res.json ({
        ok: true, 
        data
    });
}

const getTalonarioByIdUser = async ( req, res = response ) => {

    const usuario_id = req.usuario;
    console.log(usuario_id);
    
    const data = await Talonario.find({ usuario_id });
    res.json ({
        ok: true, 
        data
    });
}

const newTalonario = async (req, res = response ) => {

    const { usuario_id } = req.body;
    console.log(usuario_id);

    try {

        con = 0;
        const existeUsuario = await Usuario.findOne({ _id : usuario_id } );

        if( !existeUsuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el Usuario'
            });
        }

        const talonario = new Talonario( req.body );
        await talonario.save();

        var contenido = `
        <br>    <h1 style="text-align: center;">BINGO 2021</h1>
        <h3 style="margin-left:15px">Nombre: ${ existeUsuario.nombre }</h3>
        <h3 style="margin-left:15px">Email: ${ existeUsuario.email }</h3>
        <h3 style="margin-left:15px">Teléfono: ${ existeUsuario.telefono }</h3> <br>
        <table style="width:100%" border="1">` ;

        talonario.talonario.forEach(function(elemento) {
            if(con == 5)    contenido += "<tr>";
            contenido += `<th>${ elemento.numero  }</th>`;
            con += 1;
            if(con == 5) {
                contenido += "</tr>";
                con = 0;
            }   
        });

        contenido += `</table>`;

        await pdf.create(contenido).toFile(`./public/${ existeUsuario.email }.pdf`, function(err, res) {
            if (err){
                console.log(err);
            } else {
                console.log(res);
            }
        });

        var mailOptions = {
            from: 'nain.acero24@gmail.com',
            to: existeUsuario.email,
            subject: 'bingo2021',
            html: "<a href='https://bingo-2020.herokuapp.com/" + existeUsuario.email + ".pdf'> DESCARGAR CARTILLA</a>"
          };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        res.json({
            ok: true,
            msg: 'Cartilla Registrada',
            talonario
        });

    } catch(error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarTalonario = async ( numero ) => {

    try {
        const data = await Talonario.updateMany(
            { "talonario.numero": numero }, 
            { $set:{"talonario.$[element].salio": 1 }}, 
            { arrayFilters: [ {"element.numero": numero } ] });
            
    } catch(error) {
        console.log(error);
    }

}

const infoTalonario = async ( req, res = response ) => {
    
    const data = await Usuario.aggregate([
        { $match : 
            { role : 'USER_ROLE' } 
        },
        {
          $lookup:
            {
              from: "talonarios",
              localField: "_id",
              foreignField: "usuario_id",
              as: "talonario"
            }
       }
     ]);

    res.json ({
        data
    });
}

module.exports = {
    getTalonarios_uid, 
    newTalonario,
    actualizarTalonario,
    infoTalonario,
    getTalonarioByIdUser
}