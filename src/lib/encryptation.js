const bcrypt = require('bcrypt'); // Librería para encryptación
const config = require('../config/config');

//Función para hashear ej: contraseñas
const hash = async(input,salt) => {
    if (typeof input !== 'string') {
        throw TypeError("encryptation@hash: input must be a string!");
    } else {
        try {           
            const output = bcrypt.hash(input, salt);
            console.log(output);
            return output;
        } catch (err) {
            console.log("encryptation@hash: error %s", err);
        }
    }
}

const getSalt = async() => {
   const salt = await bcrypt.genSalt(Number(config.saltWorkFactor));
   return salt;
}

module.exports = { hash, getSalt }