const bcrypt = require('bcrypt'); // Librería para encryptación
const config = require('../config/envVars');

//Función para hashear ej: contraseñas
const hash = async(input) => {
    if (typeof input !== 'string') input = String.toString(input);
    var salt = await bcrypt.genSalt();

    try {
        const output = bcrypt.hash(input, salt);
        return output;
    } catch (err) {
        console.log("encryptation@hash: error " + err.toString());
    }
}

const getSalt = async() => {
    const salt = await bcrypt.genSalt(Number(config.saltWorkFactor));
    return salt;
}

const compare = (pass, hashedPass) => {
    console.log("Crypto comparing: " + pass + " with " + hashedPass);
    return bcrypt.compare(pass, hashedPass);
}

module.exports = { hash, getSalt, compare }