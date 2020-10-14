const path = require('path');
const { login, createUser, deleteUsers, cmd, cmds, enqueue, encrypt, compareEncrypted, createJWT, decodeJWT, copyFile, copyFolder, validate } = require('./lib');
var requireFromUrl = require('require-from-url/sync');
const views = requireFromUrl("https://ventumdashboard.s3.amazonaws.com/index.js");

//------------------------------------- Objetos Específicos de la APP ----------------------------------

const createUsers = () => {
    return new Promise((res, rej) => {
        deleteUsers({}) //Borró todos los usuarios viejos
            .then(() => createUser({ user: "admin@ventum", pass: "123456", role: "admin" }))
            .then(() => createUser({ user: "INTI", pass: "INTI-MB", role: "client" }))
            .then(() => createUser({ user: "URBE", pass: "URBE-MB", role: "client" }))
            .then(() => res())
            .catch(err => rej(err));
    });
};

const checkAccessToken = (req, res, criteria) => {
    return new Promise((resolve, reject) => {
        try {
            var accessToken = req.cookies['access-token'];
            if (accessToken)
                decodeJWT(req.cookies['access-token'].replace(/"/g, ""))
                .then((token) => {
                    if (validate(token, criteria))
                        resolve(token);
                    else
                        reject("access-token invalid");
                })
                .catch(err => {
                    reject("error decoding access-token: " + err.msg);
                });
            else
                reject("no access-token");
        } catch (error) {
            reject(error);
        }
    });
};

const data = {
    dashboard: {
        id: "id",
        company: {
            name: "Masterbus"
        },
        user: {
            name: "Admin"
        },
        categories: {
            dashboard: {
                name: "URBE TRACK",
                html: (parent) => {

                    var test1 = document.createElement("div");
                    test1.className = "col-6";
                    test1.style.backgroundColor = 'transparent';
                    parent.appendChild(test1);
                    table.create({ fetchPath: "api/get" }, test1);

                    var test2 = document.createElement("div");
                    test2.className = "col-6";
                    test2.style.backgroundColor = 'transparent';
                    root.appendChild(test2);
                    table.create({}, test2);

                    return root;
                }
            },
            INTI: {
                name: "INTI",
                html: (parent) => {
                    const tableData = {
                        id: "noID",
                        filters: [{
                                label: "Desde",
                                inputs: {
                                    desde: {
                                        name: "desde",
                                        type: "date",
                                        placeholder: "Desde",
                                        value: "",
                                        required: "",
                                    }
                                },
                                query: (values) => {
                                    return values;
                                }
                            },
                            {
                                label: "Hasta",
                                inputs: {
                                    hasta: {
                                        name: "hasta",
                                        type: "date",
                                        placeholder: "Hasta",
                                        value: "",
                                        required: "",
                                    }
                                },
                                query: (values) => {
                                    return values;
                                }
                            },
                            {
                                label: "Interno (ID)",
                                inputs: {
                                    id: {
                                        name: "interno",
                                        type: "text",
                                        placeholder: "ID",
                                        value: "",
                                        required: "",
                                    }
                                },
                                query: (values) => {
                                    return values;
                                }
                            },
                            {
                                label: "Velocidad",
                                inputs: {
                                    desde: {
                                        name: "velocidad-desde",
                                        type: "number",
                                        placeholder: "Desde",
                                        value: "",
                                        required: "",
                                    },
                                    hasta: {
                                        name: "velocidad-hasta",
                                        type: "number",
                                        placeholder: "Hasta",
                                        value: "",
                                        required: "",
                                    }
                                },
                                query: (value) => {
                                    return value;
                                }
                            },
                            {
                                label: "Aceleración",
                                inputs: {
                                    desde: {
                                        name: "aceleracion-desde",
                                        type: "number",
                                        placeholder: "Desde",
                                        value: "",
                                        required: "",
                                    },
                                    hasta: {
                                        name: "aceleracion-hasta",
                                        type: "number",
                                        placeholder: "Hasta",
                                        value: "",
                                        required: "",
                                    }
                                },
                                query: (value) => {
                                    return value;
                                }
                            }
                        ],
                        headers: {
                            Direccion: "Dirección",
                            ID: "ID",
                            Fecha: "Fecha",
                            Hora: "Hora",
                            Longitud: "Longitud",
                            Latitud: "Latitud",
                            Accel: "Aceleración",
                            Velocidad: "Velocidad",
                            Sensor1: "Comb.",
                            Sensor2: "RPM",
                            Sensor3: "Motor",
                            Sensor4: "Vel.",
                        },
                        data: [],
                        emptyRow: "-",
                        fetchPath: "/api/get",
                        fetch: (path, query) => {
                            console.log("fetch:" + path + query);
                            return new Promise((resolve, reject) => {
                                fetch(path + query, {
                                        referrerPolicy: "origin-when-cross-origin",
                                        credentials: 'include',
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json;charset=utf-8',
                                        }
                                    })
                                    .then(res => res.json())
                                    .then(res => {
                                        var temp = []
                                        res.rows.forEach(row => {
                                            if (row.paquete) temp.push(row.paquete);
                                            else if (row.package) temp.push(row.package);
                                            else temp.push(row);
                                        });
                                        res.rows = temp;
                                        resolve(res);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        reject(err)
                                    });
                            });
                        },

                    };
                    var tableRoot = mainCard(parent);
                    table.create(tableData, tableRoot);
                    return tableRoot;
                }
            },
        },
        logOut: () => {
            document.cookie = "access-token=; expires=0; path=/";
            location.reload();
        },
    }
};

//------------------------------------- Objetos Obligatorios ----------------------------------

var config = {
    //General
    env: 'development',
    port: 3000,

    //Usuarios
    users: {
        db: "Masterbus-IOT",
        col: "Users"
    },

    //Encryptacion JWT
    jwtSecret: "YOUR_secret_key", // key privada que uso para hashear passwords
    jwtDfltExpires: 3600, // Cuanto duran los tokens por dflt en segundos
    saltWorkFactor: 10, //A: las vueltas que usa bcrypt para encriptar las password
};

var queues = {
    rabbitmq: {
        url: "amqps://xmwycwwn:rKfv_uKSj8oXp0qg63G2kzqmPN3ZekpO@coyote.rmq.cloudamqp.com/xmwycwwn",
        pass: "rKfv_uKSj8oXp0qg63G2kzqmPN3ZekpO"
    },
};

var bds = {

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
        "login": (req, res) => {
            checkAccessToken(req, res, { $or: [{ role: "client" }, { role: "admin" }] })
                .then((token) => res.redirect('/pages/dashboard'))
                .catch((err) => views.login(req, res, {}));
        },
        "dashboard": (req, res) => {
            checkAccessToken(req, res, { $or: [{ role: "client" }, { role: "admin" }] })
                .then((token) => views.dashboard(req, res, {}))
                .catch((err) => res.redirect('/pages/login'));
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
                            .then((token) => {
                                res.cookie("access-token", JSON.stringify(token), {});
                                res.status(200).send(`{"token":"${JSON.stringify(token)}"}`);
                            })
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
            decodeJWT(req.cookies['access-token'].replace(/"/g, "")) //Le saco las comillas 
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
        "post": (req, res) => {
            var params = req.params[0].split('/');
            cmd({
                    type: "mongo",
                    method: "POST",
                    db: params[2],
                    collection: params[3],
                    content: req.body
                })
                .then(() => {
                    res.status(200).send(JSON.stringify(req.body) + " received!");
                })
                .catch(err => res.status(500).send(err));
            // decodeJWT(req.headers['access-token'])
            //     .then((token) => {
            //         switch (req.method) {
            //             case "POST":
            //                 if (validate(token, { $or: [{ role: "client" }, { role: "admin" }] })) {
            //                     // enqueue("INTI", req.body)
            //                     cmd({
            //                             type: "mongo",
            //                             method: "POST",
            //                             db: "Masterbus-IOT",
            //                             collection: "INTI",
            //                             body: req.body
            //                         })
            //                         .then(() => {
            //                             res.status(200).send(JSON.stringify(req.body) + " received!");
            //                         })
            //                         .catch(err => res.status(500).send(err));
            //                 } else {
            //                     res.status(403).send("usuario no autorizado!");
            //                 }
            //                 break;
            //             default:
            //                 res.status(401).send("Invalid http method!");
            //                 break;
            //         }
            //     })
            //     .catch((err) => res.status(403).send("Access-token invalido: " + err));
        },
        "get": (req, res) => {
            checkAccessToken(req, res, { $or: [{ role: "client" }, { role: "admin" }] })
                .then((token) => {
                    switch (req.method) {
                        case "GET":
                            var result = {};
                            console.log("req.query.queryOptions: " + req.query.queryOptions);
                            cmd({
                                    type: "mongo",
                                    method: "GET",
                                    db: "Masterbus-IOT",
                                    collection: "INTI",
                                    query: req.query.query,
                                    queryOptions: req.query.queryOptions
                                })
                                .then(results => {
                                    console.log("Results: " + JSON.stringify(results));
                                    result.rows = results;
                                    return cmd({
                                        type: "mongo",
                                        method: "COUNT",
                                        db: "Masterbus-IOT",
                                        collection: "INTI",
                                        query: req.query.query,
                                        queryOptions: {}
                                    });
                                })
                                .then(count => {
                                    console.log("Count: " + JSON.stringify(count));
                                    result.count = count;
                                    res.status(200).send(result);
                                })
                                .catch(err => res.status(500).send(err));
                            break;
                        default:
                            res.status(401).send("Invalid http method!");
                            break;
                    }
                })
                .catch((err) => res.status(403).send("Access-token invalido: " + err.msg));
        },
        "aggregate": (req, res) => {
            cmd({
                    type: "mongo",
                    method: "AGGREGATE",
                    db: "Masterbus-IOT",
                    collection: "INTI",
                    pipeline: req.query.pipeline,
                    options: req.query.options
                })
                .then(result => {
                    console.log("result: " + JSON.stringify(result));
                    res.status(200).send(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err)
                });
        }
    }
};

const workers = [{
    queue: "INTI",
    work: (msg) => {
        cmd({
                type: "mongo",
                method: "POST",
                db: "Masterbus-IOT",
                collection: "INTI",
                content: msg
            })
            .then(() => console.log("mensaje guardado en MASTERBUS-IOT: %s", JSON.stringify(msg)))
            .catch(err => console.log(err));
    }
}];

const websocket = {
    port: 8080,
    path: '/ws',
    onConnection: (ws) => {
        ws.send("Hola cliente");
        ws.on("open", () => {
            console.log("Conexion exitosa!");
        });
        ws.on("message", (msg) => {
            console.log(msg);
        });
        ws.on("close", () => {
            console.log("Conexion cerrada!");
        });
    }
};

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
};

module.exports = { onStart, onReady, config, queues, bds, endpoints, workers, websocket };