const { response } = require("express");
const Talonario = require("../models/talonario");
const Usuario = require("../models/usuario");
const nodemailer = require("nodemailer");
var pdf = require('html-pdf');
const { v4: uuidv4 } = require('uuid');

var idUser = "";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nain.acero24@gmail.com',
      pass: 'dmtcbkxzjxlvnnph'
    }
  });

const getTalonarios_uid = async ( req, res = response ) => {

    const usuario_id = req.usuario._id;
    
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

        var contenido = `<html>
        <head>
        <meta charset="utf-8">
        <title>Talonario</title>
        <style>
            body {
                padding: 0;
                margin: 0;
                font-family: sans-serif;
            }
            
            .card {
                width: 100%;
                max-width: 434px;
                position: relative;
                margin: 0;
                padding: 0;
                border-collapse: collapse;
                border: 2px solid #000;
                table-layout: fixed;
            }

            .card td {
                height: 80px;
                padding: 5px;
                border: 1px solid #000;
                font-size: 36px;
                vertical-align: middle;
                text-align: center;
                line-height: 30px;
                font-weight: bold;
                overflow: hidden;
                overflow-wrap: break-word;
            }

            .card td.th {
                font-size: 40px;
                font-weight: bold;
                width: 20%;
                height: 60px;
                border: 1px solid #000;
                border-bottom-width: 2px;
                line-height: 30px;
                text-align: center;
            }
            
            .card td .cellInner {
                display: inline-block;
                vertical-align: middle;
                max-height: 73px;
                width: 100%;
                overflow-y: hidden;
            }

            .card td.free {
                padding: 0;
                text-align: center;
                vertical-align: middle;
            }
        </style>
        </head>
        <body>
        <br>    <h1 style="text-align: center;">BINGO 2021</h1>
        <div style="padding: 12px;margin-left:55px;"><h4 style="margin: 0 0 12px 0;">Nombre</h4><span>${existeUsuario.nombre}</span></div>
        <div style="padding: 12px;margin-left:55px;"><h4 style="margin: 0 0 12px 0;">Email</h4><span>${existeUsuario.email}</span></div>
        <div style="padding: 12px;margin-left:55px;"><h4 style="margin: 0 0 12px 0;">Teléfono</h4><span>${existeUsuario.telefono}</span></div> <br>
        <div style="padding: 12px;padding: 12px;"><table class="card" style="margin: 0 auto;">
        <tbody><tr><td class="th"><div class="cellInner">B</div></td><td class="th"><div class="cellInner">I</div></td><td class="th"><div class="cellInner">N</div></td><td class="th"><div class="cellInner">G</div></td><td class="th"><div class="cellInner">O</div></td></tr>` ;

        talonario.talonario.forEach(function(elemento) {
            if(con == 5)    contenido += "<tr>";
            if(elemento.numero === 0) {
                contenido += `<td class="box logo"><img src="https://bingo-2020.herokuapp.com/assets/free.png" width="72"></td>`;
            }
            else {
                contenido += `<td class="box"><div class="cellInner">${elemento.numero}</div></td>`;
            }
            con += 1;
            if(con == 5) {
                contenido += "</tr>";
                con = 0;
            }   
        });

        contenido += `</tbody></table></div></body></html>`;
        // console.log(contenido);
        idUser = uuidv4() + "-" + existeUsuario.email;

        await pdf.create(contenido,{ timeout: '100000' }).toFile(`./public/${ idUser }.pdf`, function(err, res) {
            if(err){
                console.log(err);
            }
        });

        var mailOptions = {
            from: 'nain.acero24@gmail.com',
            to: existeUsuario.email,
            subject: 'bingo2021',
            html: "<a href='https://bingo-2020.herokuapp.com/" + idUser + ".pdf'> DESCARGAR CARTILLA</a>"
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