//Script que oculta el manejo de las bases de datos...
//TODO: Persistir todo en un base relacional a largo plazo
//const {get, getCount, deleteMany } = require('../lib/mongodb/mongoDbHelpers');
// const queue = require('../queues');
const mongoDb = require('../../lib/mongodb');
const mariaDb = require('../../lib/mariadb');

const config = require('../../config');
const crypto = require('../../lib/encryptation');
const utils = require('../../lib/utils');

const cmd = (msg) => {
    console.log("repo@cmd: %s", msg);
    switch (msg.type) {
        case "mongo":
            return mongoDb.query(msg);
        case "maria":
            return mariaDb.query(msg);
        default:
            console.error("repo@consume: Incorrect msg type: %s", msg.type);
            return new Promise((resolve, reject) => {
                resolve();
            });
    }
};

const cmds = (msgs) => {
    return new Promise((resolve, reject) => {
        try {
            if (msgs.length == 0) resolve();
            else {
                msg = msgs.shift();
                cmd(msg)
                    .then(cmds(msgs).then(resolve()))
                    .catch(err => reject(err));
            }
        } catch (err) {
            reject(err);
        }
    })
};

const setBDS = (ADN) => {
    const repo = ADN.repo;
    return new Promise((resolve, reject) => {
        mongoDb.setup(repo.getDB('mongo'))
            //.then(res => mariaDb.setup(repo.getDB('maria')))
            .then(res => resolve(ADN))
            .catch(err => reject(err));
    });
};

// Me devuelve un token si el usuario y pass son correctos
const login = (user, pass) => {};

//Funcion que crea usuario 'root'
const createRootUser = (ADN) => {
    return new Promise((resolve, reject) => {
        //A: Borra todos los registros de usuarios root anteriores para asegurarme que es único
        const eraseOldRootUsers = {
            method: "DELETE_MANY",
            db: config.usersDB,
            collection: config.usersCollection,
            query: { role: "root" },
            queryOptions: {}
        };

        const createNewRootUser = {
            method: "POST",
            db: config.usersDB,
            collection: config.usersCollection,
            query: { role: "root" },
            queryOptions: {}
        };

        mongoDb.query(eraseOldRootUsers)
            //deleteMany(config.usersDB, config.usersCollection, { role: "root" })
            .then(() => crypto.hash(config.rootPass))
            //A: Encrypto el pass que saco de la variable de entorno con mi llave privada
            .then((hashedPass) => { return { user: config.rootUser, pass: hashedPass, role: 'root' } })
            //A: Creo el root usuer y lo guardo en la bd/collection configurada (Ojo que se envía a la cola... no es syncronico)
            .then((rootUser) => mongoDb.query(createNewRootUser))
            .then((rootUser) => {
                var clonedRootUser = utils.copy(rootUser);
                delete clonedRootUser.pass; //A: No devuelvo la llave (aunque este hasheada)
                resolve(ADN);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

// Inicializo el repositorio del proyecto
const setup = (ADN) => {
    return new Promise((resolve, reject) => {
        setBDS(ADN)
            //.then(ADN => createRootUser(ADN))
            .then(ADN => cmds(ADN.repo.setupCmds))
            .then(res => {
                console.log("repo@setup: ready!");
                resolve(ADN);
            })
            .catch(err => reject(err));
    });
};

// module.exports = { setup, post, get, getCount, getUserData, createRootUser, deleteMany };
module.exports = { setup, createRootUser, login };