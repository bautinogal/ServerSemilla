//Script que oculta el manejo de las bases de datos...
//TODO: Persistir todo en un base relacional a largo plazo
const {get, getCount, deleteMany } = require('../lib/mongodb/mongoDbHelpers');
const queue = require('../lib/queue');
const config = require('../config/envVars');
const crypto = require('./encryptation');
const utils = require('./utils');

//TODO: DEBERÍA DEVOLVERME OTRA PROMESA QUE SE CUMPLA UNA VEZ QUE SE GUARDA EN LA BD NO EN LA COLA
const post = (db, collection, message) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(`Repo@post/${db}/${collection} message: ${JSON.stringify(message)}`);
            queue.send('POST', db, collection, message);
            resolve(message);
        } catch (err) {
            reject(err)
        }
    });
};

// Si el usuario y la constraseña son correctas, devuelve toda la info del usuario menos el pass
const getUserData = (user, pass) => {
    return new Promise((resolve, reject) => {
        get(config.usersDB, config.usersCollection, { user: user }, {})
            .then((users) => {
                const elementsCount = users.length;
                if (elementsCount == 0) {
                    reject('Error: Not user found for: ' + user);
                } else if (elementsCount > 1) {
                    reject('Error: More than one user found for: ' + user + ", user.user must be a unique identifier!");
                } else {
                    crypto.compare(pass, users[0].pass)
                        .then((res) => {
                            if (res) {
                                delete users[0].pass;
                                console.log("getUserData %s", users[0]);
                                resolve(users[0]);
                            } else {
                                reject('Error: Does not match password for: ' + user);
                            }
                        })
                        .catch((err) => reject(err));
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

//Funcion que crea usuario 'root'
const createRootUser = () => {
    return new Promise((resolve, reject) => {
        //A: Borra todos los registros de usuarios root anteriores para asegurarme que es único
        deleteMany(config.usersDB, config.usersCollection, { role: "root" })
            .then(() => crypto.hash(config.rootPass))
            //A: Encrypto el pass que saco de la variable de entorno con mi llave privada
            .then((hashedPass) => {
                return { user: config.rootUser, pass: hashedPass, role: 'root' }
            })
            //A: Creo el root usuer y lo guardo en la bd/collection configurada (Ojo que se envía a la cola... no es syncronico)
            .then((rootUser) => post(config.usersDB, config.usersCollection, rootUser))
            .then((rootUser) => {
                var clonedRootUser = utils.copy(rootUser);
                delete clonedRootUser.pass; //A: No devuelvo la llave (aunque este hasheada)
                resolve(clonedRootUser);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { post, get, getCount, getUserData, createRootUser, deleteMany };