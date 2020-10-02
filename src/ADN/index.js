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
            .then(() => res())
            .catch(err => rej(err));
    });
};

//------------------------------------- Limbo ---------------------------------------------------

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

// const views = {
//     dashboard: () => {
//         const data = { fetchPass: "api/get" };
//         const originPath = "https://drive.google.com/uc?export=view&id=1o_7lBi3mSyakXCzO1DHLHv3t5yotUEeA";

//         console.log(originPath);
//         return new Promise((resolve, reject) => {
//             try {
//                 JSDOM.fromURL(originPath)
//                     .then(dom => {
//                         var script = dom.window.document.createElement("script");
//                         script.type = "module";
//                         //var innerHTML = `console.log("hola");`;
//                         // var innerHTML = `import dashboard from "/public/dashboard/dashboard.js";`;
//                         // var innerHTML = `import dashboard from "https://drive.google.com/uc?export=view&id=1oXP8QSonh3s_pwp9oxos4UaMJvz5xPFw";`;
//                         // var innerHTML = `import dashboard from "https://www.googleapis.com/drive/v2/files/1oXP8QSonh3s_pwp9oxos4UaMJvz5xPFw?alt=media&source=downloadUrl";`;
//                         // innerHTML += `dashboard.init((${JSON.stringify(data)}))`;
//                         var innerHTML = `init((${JSON.stringify(data)}))`;
//                         script.innerHTML = innerHTML;
//                         dom.window.document.body.appendChild(script);
//                         resolve(dom.serialize());
//                     })
//                     .catch(err => reject(err));
//             } catch (error) {
//                 reject(error);
//             }
//         })
//     },
//     login: () => {

//     }
// }

//------------------------------------- Objetos Obligatorios ----------------------------------

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
        "login": (req, res) => {
            var accessToken = req.cookies['access-token'];
            if (accessToken)
                decodeJWT(req.cookies['access-token'].replace(/"/g, ""))
                .then((token) => views.dashboard(req, res, {}))
                .catch(err => {
                    console.log(err);
                    views.login(req, res, {})
                });
            else
                views.login(req, res, {})
        },
        "dashboard": (req, res) => {
            var accessToken = req.cookies['access-token'];
            if (accessToken)
                decodeJWT(req.cookies['access-token'].replace(/"/g, ""))
                .then((token) => views.dashboard(req, res, {}))
                .catch(err => {
                    console.log(err);
                    views.login(req, res, {})
                });
            else
                views.login(req, res, {})
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
                                res.status(200).send(token)
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
            cmd({
                    type: "mongo",
                    method: "POST",
                    db: "Masterbus-IOT",
                    collection: "INTI",
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
            // Cookies that have not been signed
            console.log(req.cookies['access-token']);
            console.log('Cookies: ', req.cookies);
            // Cookies that have been signed
            console.log('Signed Cookies: ', req.signedCookies);
            decodeJWT(req.cookies['access-token'].replace(/"/g, ""))
                .then((token) => {
                    switch (req.method) {
                        case "GET":
                            if (validate(token, { $or: [{ role: "client" }, { role: "admin" }] })) {
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
                                    .then(posts => {
                                        console.log("Results: " + JSON.stringify(posts));
                                        result.rows = posts;
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

module.exports = { onStart, onReady, queue, repo, endpoints, workers };