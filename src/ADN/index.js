const views = require('./views');
const path = require('path');
const lib = require('./lib');

const createRootUserRepoCmd = () => {
    repo.setupCmds.push({
        user: "admin",
        pass: lib.encrypt("secreto")
    });
};

//--------------------------------------------------------------------------------------

const config = {
    //General
    env: 'development',
    port: 3000,

    //Usuarios
    usersDB: 'test',
    usersCollection: 'users',
    rootUser: 'root',
    rootPass: 'secret',

    //Encryptacion JWT
    jwtSecret: "YOUR_secret_key", // key privada que uso para hashear passwords
    jwtDfltExpires: 3600, // Cuanto duran los tokens por dflt en segundos
    saltWorkFactor: 10, //A: las vueltas que usa bcrypt para encriptar las password

    //Cola AMQP
    amqpUrl: 'amqp://localhost', //URL de la cola AMQP

    //MongoDB
    mongoUri: 'mongodb://localhost:27017', //URL del Cluster de MongoDb
    // mongoUri: process.env.MONGODB_PUBLIC_KEY || 'CXSIZTBG', // Clave pública del Cluster de MongoDb
    // mongoUri: process.env.MONGODB_PRIVATE_KEY || 'b25b1b51-72dd-4da3-9aea-c64f12437e966', // Clave privada del 

    //TODO: ver si usamos user/pass o ssh
    //MariaDB
    mariaDbName: 'semilla', //Nombre de la base de datos relacional (MySQL)
    mariaDbHost: 'localhost', //URL del servidor remoto donde se aloja la base de datos relacional 
    mariaDbUser: 'root',
    mariaDbPass: '',
    mariaDbPort: '3306', // Puerto de la base de datos alojada en servidor remoto
};

const queue = {
    url: "amqps://xmwycwwn:rKfv_uKSj8oXp0qg63G2kzqmPN3ZekpO@coyote.rmq.cloudamqp.com/xmwycwwn",
    pass: "rKfv_uKSj8oXp0qg63G2kzqmPN3ZekpO"
};

var repo = {
    // Función que me devuelve la data de cada bd
    getDB: (db) => {
        switch (db) {
            case "mongo":
                return {
                    url: "mongodb+srv://masterbus-iot-server:masterbus@cluster0.uggrc.mongodb.net/INTI-Test?retryWrites=true&w=majority",
                    dfltDb: "dflt"
                };
            case "maria":
                return {
                    name: "semilla_test",
                    url: "semilla.c7mwpiipndbn.us-west-1.rds.amazonaws.com",
                    user: "ventum",
                    pass: "VentumAdmin",
                    port: 3306
                };
            default:
                return {};
        }
    },

    // Comandos que se van a llamar cuando se inicializa el repo
    setupCmds: [
        //eraseOldRootUsers 
        {
            type: "mongo",
            method: "DELETE",
            db: "dflt",
            collection: "users",
            query: { role: "root" },
            queryOptions: {}
        }
    ]
};

const endpoints = {
    "test": (req, res) => {
        res.send("hola");
    },
    "dashboard": (req, res) => {
        views.dashboard() // Crea un .html y me devuelve el path
            .then(view => {
                res.send(view);
            })
            .catch(err => console.log(err));
    },
    "api": {
        "login": (req, res) => {
            const user = req.body.user;
            const pass = req.body.pass;
            if (user && pass) {
                switch (req.method) {
                    case "POST":
                        login(user, pass)
                            .then((loginData) => res.status(200).send(JSON.stringify(loginData)))
                            .catch((err) => res.status(403).send("user o pass invalido!"));
                        break;
                    default:
                        res.status(401).send("invalid http method!");
                        break;
                }
            } else {
                res.status(403).send("user y pass requeridos!");
            }
        },
        "users": (req, res) => {
            decrypt(req.headers['access-token'])
                .then((token) => {
                    switch (req.method) {
                        case "POST":
                            validate(token, { role: "root" })
                                .then((authorized) => {
                                    if (authorized) {
                                        var newUser = req.body;
                                        validate(newUser, {
                                                $and: [
                                                    { "user": { $type: "string" } },
                                                    { "pass": { $type: "string" } },
                                                    { "role": { $type: "string" } }
                                                ]
                                            })
                                            .then((bodyCorrect) => {
                                                if (bodyCorrect)
                                                    encrypt(newUser.pass)
                                                    .then((hashedPass) => {
                                                        post("masterbusIOT/users", req.body)
                                                            .then((users) => res.send(JSON.stringify(users)))
                                                            .catch((err) => res.status(500).send("error creando el usuario! " + err));
                                                    })
                                                    .catch((err) => res.status(500).send("error creando el usuario!" + err));
                                                else
                                                    res.send("formato del nuevo usuario incorrecto!");
                                            })
                                            .catch((err) => res.status(500).send("error validando el nuevo usuario! " + err));

                                    } else {
                                        res.status(403).send("usuario no autorizado!");
                                    }
                                })
                                .catch((err) => res.status(500).send("error validando token! " + err));
                            break;
                        default:
                            res.status(401).send("Invalid http method!");
                            break;
                    }
                })
                .catch((err) => res.status(403).send("Access-token invalido: " + err));
        }
    },
    "masterbusIOT": {
        "INTI": (req, res) => {
            decrypt(req.headers['access-token'])
                .then((token) => {
                    switch (req.method) {
                        case "POST":
                            validate(token, { $or: [{ role: "root" }, { role: "client" }] })
                                .then((authorized) => {
                                    if (authorized) {
                                        post("masterbusIOT/INTI", req.body)
                                            .then((users) => res.send(JSON.stringify(users)))
                                            .catch((err) => res.status(500).send("error creando el usuario!"));
                                    } else {
                                        res.status(403).send("usuario no autorizado!");
                                    }
                                })
                                .catch((err) => res.status(500).send("error validando token! " + err));
                            break;
                        case "GET":
                            validate(token, { $or: [{ role: "root" }, { role: "client" }] })
                                .then((authorized) => {
                                    if (authorized) {
                                        get("masterbusIOT/INTI", req.query.query, req.query.queryOptions)
                                            .then((data) => res.send(JSON.stringify(data)))
                                            .catch((err) => res.status(500).send("error creando el usuario!"));
                                    } else {
                                        res.status(403).send("usuario no autorizado!");
                                    }
                                })
                                .catch((err) => res.status(500).send("error validando token! " + err));
                            break;
                        default:
                            res.status(401).send("invalid http method!");
                            break;
                    }
                })
                .catch((err) => res.status(403).send("access-token invalido: " + err));
        }
    }
};

const workers = {};

// Incializo mi app semilla
const setup = () => {
    console.log(`adn@setup: starting!`);
    return new Promise((resolve, reject) => {
        createRootUserRepoCmd();
        resolve(module.exports);
    });
};

module.exports = { setup, queue, repo, endpoints, workers };