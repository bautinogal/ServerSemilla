const bcrypt = require('bcrypt'); // Librería para encryptación
const config = require('../config/envVars');
const mingo = require('mingo');

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

const decodeToken = (hashedToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(hashedToken, config.jwtSecret, (err, decoded) => {
            if (err) {
                reject('Error decodificando token! ' + err);
            } else {
                resolve(decoded);
            }
        });
    })
}

//Ver si el token recibido cumple con la "criteria"
//TODO: VER SI ESTA BIEN USAR ESTE TIPO DE FILTRO (TIPO QUERY DE MONGO USANDO "MINGO")
const validateToken = (token, criteria) => {
    //TODO: validar "criteria"...
    // creo un query con el criterio
    let query = new mingo.Query(criteria);
    // veo si el token cumple con el criterio
    return query.test(token);
}

module.exports = { hash, getSalt, compare, decodeToken, validateToken }