//---------------------- Parámetros "Semilla" ----------------------------------
//Acá encontramos y configuramos todas las reglas de negocio de cada app en particular
//lo vamos a usar como parámetros de entrada para la app semilla
const { login, get, post, encrypt, decrypt, consume } = require('./lib/index');
const path = require('path'); // Herramienta para armar los paths independientemente del S.O.

//Acá defino la lógica de cada endpoint
//TODO: ver como podríamos pasar esto a REGEX
var endpoints = {
    "dashboard": (req, res) => {
        var path = views.dashboard()
            .then(view => {
                res.send(view);
            })
            .catch(err => console.log(err)); // Crea un .html y me devuelve el path
    },
    "table": {
        "1": (req, res) => {
            res.send("table1");
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

var views = {
    dashboard: () => {
        return new Promise((resolve, reject) => {
            try {
                const data = {

                };
                let dashboard = require('./views/dashboard/dashboard');
                result = dashboard.create(data)
                    .then(res => resolve(res));
            } catch (error) {
                reject(error);
            }
        })
    }
};

var workers = {
    postUsersQueue2DB: () => {
        const queueName = 'POST/' + config.usersDB + '/' + config.usersCollection;
        consume(queueName, (document) => {
            console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
            post(config.usersDB, config.usersCollection, document)
                .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}`))
                .catch(err => console.log(`Routes@queueToDb error: ${err}`));
        });
    },
    deleteUsersQueue2DB: () => {
        const queueName = 'DELETE/' + config.usersDB + '/' + config.usersCollection;
        queue.receive(queueName, (query) => {
            console.log(`Worker@consume: ${JSON.stringify(query)} to ${queueName}`);
            mongoDbHelper.deleteMany(config.usersDB, config.usersCollection, query, queryOptions)
                .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} deleted from ${queueName}`))
                .catch(err => console.log(`Routes@queueToDb error: ${err}`));
        });
    },
    postINTIQueue2DB: () => {
        const queueName = 'POST/Masterbus-IOT/INTI';
        consume(queueName, (document) => {
            console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
            save(config.usersDB, config.usersCollection, document)
                .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}`))
                .catch(err => console.log(`Routes@queueToDb error: ${err}`));
        });
    }
};

module.exports = { endpoints, workers, views };