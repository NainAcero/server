const { response } = require("express");

var numeros = new Array();

for(i = 1 ; i <= 75 ; i++){
    
    numeros.push(i);
}

var numeros_bingo = [];

const sacar_numero = ( ) => {

    let i = Math.floor(Math.random() * (numeros.length ) );
    let data = numeros[i];

    if(data == undefined){
        return 'SN';
    }

    numeros.splice(i,1);
    numeros_bingo.push(data);

    return data;
}

module.exports = {
    sacar_numero
}