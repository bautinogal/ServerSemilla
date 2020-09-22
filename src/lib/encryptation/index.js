const bcrypt = require('bcrypt'); // Librería para encryptación
const config = require('../../config');
const mingo = require('mingo');
const jwt = require('jsonwebtoken');

//TODO: parametrizar esto en algún lado
const JWTKey = "supersecreto"

const getSalt = async() => {
    const salt = await bcrypt.genSalt(Number(config.saltWorkFactor));
    return salt;
}

//-------------------------------------------------------

//Función para hashear ej: contraseñas
const encrypt = async(input) => {
    if (typeof input !== 'string') input = String.toString(input);
    var salt = await bcrypt.genSalt();
    try {
        const output = bcrypt.hash(input, salt);
        return output;
    } catch (err) {
        console.log("encryptation@hash: error " + err.toString());
    }
};

const compareEncrypted = (data, hashedData) => {
    console.log("Crypto comparing: " + data + " with " + hashedData);
    return bcrypt.compare(data, hashedData);
};

const createJWT = (token, expiresIn) => {
    return new Promise((resolve, reject) => {
        try {
            const JWT = jwt.sign({
                data: token
            }, JWTKey, { expiresIn: (expiresIn || '1h') });
            console.log("encrypation@createJWT: JWT created: %s!", JWT);
            resolve(JWT);
        } catch (error) {
            console.log("encrypation@createJWT: Error creating JWT: %s!", error);
            reject(error);
        }
    });
}

const decodeJWT = (hashedToken) => {
    return new Promise((resolve, reject) => {
        try {
            var decoded = jwt.verify(hashedToken, JWTKey);
            console.log("decoded token: %s", JSON.stringify(decoded));
            resolve(decoded.data);
        } catch (error) {
            console.log("error decoding token: %s", error);
            reject(error);
        }
    });
}


module.exports = { encrypt, compareEncrypted, createJWT, decodeJWT }