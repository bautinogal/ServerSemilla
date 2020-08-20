const bcrypt = require('bcrypt'); // Librería para encryptación
const config = require('../config/config');

//Función para hashear ej: contraseñas
const hash = async(input, salt) => {
    if (typeof input !== 'string') {
        input = String.toString(input);
    }
    try {
        const output = bcrypt.hash(input, salt);
        console.log(output);
        return output;
    } catch (err) {
        console.log("encryptation@hash: error %s", err);
    }

}

const getSalt = async() => {
    const salt = await bcrypt.genSalt(Number(config.saltWorkFactor));
    return salt;
}

const compare = (saltedHash0, saltedHash1) => {
    console.log(saltedHash0);
    console.log(saltedHash1);
    return bcrypt.compare(saltedHash0, saltedHash1);
}

module.exports = { hash, getSalt, compare }