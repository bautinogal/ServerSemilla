//Script que oculta el manejo de las bases de datos...
//TODO: Persistir todo en un base relacional a largo plazo
const {get, getCount, deleteMany } = require('../lib/mongodb/mongoDbHelpers');
const queue = require('../lib/queue');
const config = require('../config/config');
const crypto = require('./encryptation');

//TODO: DEBERÍA DEVOLVERME UNA PROMESA QUE SE CUMPLA UNA VEZ QUE SE GUARDA EN LA BD NO EN LA COLA
const post = (db, collection, message) => {
    console.log(`Repo@post/${db}/${collection} message: ${JSON.stringify(message)}`);
    queue.send('POST', db, collection, message);
};

const deleteDocuments = (db, collection, query) => {
    console.log(`Repo@delete/${db}/${collection} query:${query}`);
    queue.send('DELETE', db, collection, query);
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
                                users[0].pass = undefined;
                                resolve(users[0]);
                            } else {
                                reject('Error: Does not match password for: ' + user);
                            }
                        })
                        .catch((err) => console.log(err));
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
        try {
            const rootUser = {
                user: config.rootUser,
                pass: crypto.hash(config.rootPass)
            }
            const rootUserQuery = { role: "root" };
            //A: Borra todos los registros de usuarios root anteriores para asegurarme que es único
            deleteMany(config.usersDB, config.usersCollection, rootUserQuery)
                .then((res) => {
                    //TODO: PONGO ESTO PARA ASEGURARME QUE EL DELETE PASE ANTES QUE EL POST, PERO ESTA MAL
                    setTimeout(() => {
                        //A: Creo el nuevo root user (Ojo que se envía a la cola... no es syncronico)
                        post(config.usersDB, config.usersCollection, rootUser);
                        rootUser.pass = "";
                        resolve(rootUser);
                    }, 5000)
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { post, get, getCount, getUserData, createRootUser };