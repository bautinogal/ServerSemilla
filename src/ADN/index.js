const views = require('./views');
const { login, createUser, deleteUsers, cmd, cmds, enqueue, encrypt, compareEncrypted, createJWT, decodeJWT, copyFile, copyFolder, validate } = require('./lib');


//------------------------------------- Objetos Específicos de la APP ----------------------------------

const createUsers = () => {
    return new Promise((res, rej) => {
        deleteUsers({}) //Borró todos los usuarios viejos
            .then(() => createUser({ user: "admin@ventum", pass: "123456", role: "admin" }))
            .then(() => createUser({ user: "INTI", pass: "INTI-MB", role: "client" }))
            .then(() => res())
            .catch(err => rej(err));
    });
}


//------------------------------------- Objetos Obligatorios ----------------------------------

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
    users: {
        db: "Masterbus-IOT",
        col: "Users"
    },
    mongo: {
        url: "mongodb+srv://masterbus-iot-server:masterbus@cluster0.uggrc.mongodb.net/INTI-Test?retryWrites=true&w=majority",
        dfltDb: "dflt"
    },
    maria: {
        name: "semilla_test",
        url: "semilla.c7mwpiipndbn.us-west-1.rds.amazonaws.com",
        user: "ventum",
        pass: "VentumAdmin",
        port: 3306
    }
};

const endpoints = {
    "pages": {
        "dashboard": (req, res) => {
            views.dashboard.create() // Crea un .html y me devuelve el path
                .then(view => {
                    res.send(view);
                })
                .catch(err => console.log(err));
        }
    },
    "api": {
        "login": (req, res) => {
            const user = req.body.user;
            const pass = req.body.pass;
            if (user && pass) {
                switch (req.method) {
                    case "POST":
                        login(user, pass)
                            .then((token) => res.status(200).send(token))
                            .catch((err) => res.status(403).send(err));
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
            decodeJWT(req.headers['access-token'])
                .then((token) => {
                    switch (req.method) {
                        case "GET":
                            if (validate(token, { role: "admin" })) {
                                cmd({
                                        type: "mongo",
                                        method: "GET",
                                        db: repo.users.db,
                                        collection: repo.users.col,
                                        query: {},
                                        queryOptions: {}
                                    })
                                    .then(users => {
                                        users.forEach(user => {
                                            delete user.pass;
                                        });
                                        res.status(403).send(users);
                                    })
                                    .catch(err => res.status(500).send(err));
                            } else {
                                res.status(403).send("usuario no autorizado!");
                            }
                            break;
                        default:
                            res.status(401).send("Invalid http method!");
                            break;
                    }
                })
                .catch((err) => res.status(403).send("Access-token invalido: " + err));
        },
        "newUser": (req, res) => {
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
        },
        "post": (req, res) => {
            decrypt(req.headers['access-token'])
                .then((token) => {
                    switch (req.method) {
                        case "POST":
                            validate(token, { role: "root" })
                                .then((authorized) => {
                                    if (authorized) {
                                        var newUser = req.body;
                                        return validate(newUser, {
                                            $and: [
                                                { "user": { $type: "string" } },
                                                { "pass": { $type: "string" } },
                                                { "role": { $type: "string" } }
                                            ]
                                        });
                                    } else {
                                        res.send("formato del nuevo usuario incorrecto!");
                                    }
                                })
                                .then((bodyCorrect) => {
                                    if (bodyCorrect == true)
                                        encrypt(newUser.pass)
                                        .then((hashedPass) => {
                                            enqueue("masterbusIOT/users", req.body)
                                                .then((users) => res.send(JSON.stringify(users)))
                                                .catch((err) => res.status(500).send("error creando el usuario! " + err));
                                        })
                                        .catch((err) => res.status(500).send("error creando el usuario!" + err));
                                    else if (bodyCorrect == false) //Puede ser null si falló antes
                                        res.send("formato del nuevo usuario incorrecto!");
                                })
                                .catch((err) => res.status(500).send("error validando el nuevo usuario! " + err));
                        default:
                            res.status(401).send("Invalid http method!");
                    }
                })
                .catch((err) => res.status(500).send("error desencryptando token! " + err))
        },
        "get": (req, res) => {
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
    }
};

// decrypt(req.headers['access-token'])
//     .then((token) => {
//         switch (req.method) {
//             case "POST":
//                 validate(token, { $or: [{ role: "root" }, { role: "client" }] })
//                     .then((authorized) => {
//                         if (authorized) {
//                             post("masterbusIOT/INTI", req.body)
//                                 .then((users) => res.send(JSON.stringify(users)))
//                                 .catch((err) => res.status(500).send("error creando el usuario!"));
//                         } else {
//                             res.status(403).send("usuario no autorizado!");
//                         }
//                     })
//                     .catch((err) => res.status(500).send("error validando token! " + err));
//                 break;
//             case "GET":
//                 validate(token, { $or: [{ role: "root" }, { role: "client" }] })
//                     .then((authorized) => {
//                         if (authorized) {
//                             get("masterbusIOT/INTI", req.query.query, req.query.queryOptions)
//                                 .then((data) => res.send(JSON.stringify(data)))
//                                 .catch((err) => res.status(500).send("error creando el usuario!"));
//                         } else {
//                             res.status(403).send("usuario no autorizado!");
//                         }
//                     })
//                     .catch((err) => res.status(500).send("error validando token! " + err));
//                 break;
//             default:
//                 res.status(401).send("invalid http method!");
//                 break;
//         }
//     })
//     .catch((err) => res.status(403).send("access-token invalido: " + err));


const workers = [{
    queue: "Incoming",
    work: (msj) => {
        cmd(msj);
    }
}];

// Incializo mi app semilla
const onStart = () => {
    console.log(`adn@setup: starting!`);
    return new Promise((resolve, reject) => {
        resolve(module.exports);
    });
};

const onReady = () => {
    return new Promise((resolve, reject) => {
        createUsers()
            .then(() => {
                console.log(`adn@onReady: ready!`);
                resolve(module.exports);
            })
            .catch(err => reject(err));
    });
}

module.exports = { onStart, onReady, queue, repo, endpoints, workers };