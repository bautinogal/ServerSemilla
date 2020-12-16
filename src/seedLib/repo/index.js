//Script que oculta el manejo de las bases de datos...
//TODO: Persistir todo en un base relacional a largo plazo
const mongoDb = require('../../lib/mongodb');
const mariaDb = require('../../lib/mariadb');

//Los users van a estar en mongo por ahora
var users = {};

const setBDS = (ADN) => {
    const repo = ADN.repo;
    return new Promise((resolve, reject) => {
        mongoDb.setup(repo['mongo'])
            //.then(res => mariaDb.setup(repo.getDB('maria')))
            .then(res => resolve(ADN))
            .catch(err => reject(err));
    });
};

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

// Inicializo el repositorio del proyecto
const setup = (ADN) => {
    return new Promise((resolve, reject) => {
        users.db = ADN.repo.users.db;
        users.col = ADN.repo.users.col;
        setBDS(ADN)
            .then(res => {
                console.log("repo@setup: ready!");
                resolve(ADN);
            })
            .catch(err => reject(err));
    });
};

// module.exports = { setup, post, get, getCount, getUserData, createRootUser, deleteMany };
module.exports = { setup, users, cmd, cmds };