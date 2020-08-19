const bcrypt = require('bcrypt'); // Librería para encryptación

//Función para hashear ej: contraseñas
const hash = async(input) => {
    if (typeof pass !== 'string') {
        throw TypeError("encryptation@hash: input must be a string!");
    } else {
        try {
            const salt = await bcrypt.genSalt(config.saltWorkFactor);
            return bcrypt.hash(input, salt);
        } catch (err) {
            console.log("encryptation@hash: error %s", err);
        }
    }
}

module.exports = { hash }