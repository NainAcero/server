const { response } = require("express");
const Bolilla = require("../models/bolilla");

const guardarBolilla = async ( numero ) => {

    try {

        const data = {  numero: numero  }

        const bolilla = new Bolilla( data );
        bolilla.save();
        
    } catch(error) {
        console.log(error);
    }

}

const getBolillas = async ( req, res = response ) => {

    const bolillas = await Bolilla
        .find({ _id: { $ne: req.uid } });

    res.json ({
        ok: true, 
        bolillas
    });
}

module.exports = {
    guardarBolilla,
    getBolillas
}