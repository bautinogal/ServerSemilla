//INFO: las variables que se usan a lo largo del codigo, se usan las cargadas en variables de entorno o default

const { subscribe } = require("../routes");

//TODO: VER COMO MANEJO LAS VARIABLES SEMILLAS, CUALES VAN A ENV Y CUALES A SEMILLA
const config = {

    //---------------------- Variables de Entorno --------------------------------

    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,

    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", // key privada que uso para hashear passwords
    jwtDfltExpires: process.env.JWT_DURATION || 3600, // Cuanto duran los tokens por dflt en segundos
    saltWorkFactor: process.env.SALT_WORK_FACTOR || 10, //A: las vueltas que usa bcrypt para encriptar las password

    queueUrl: process.env.AMQP_URI || 'amqp://localhost',

    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017', //URL del Cluster de MongoDb

    usersDB: process.env.USERS_DB || 'test',
    usersCollection: process.env.USERS_COLLECTION || 'users',
    rootUser: process.env.ROOT_USER || 'root',
    rootPass: process.env.ROOT_PASS || 'secret',

    //---------------------- Variables de "Semilla" ----------------------------------

    //Payload includes: protocol, url, req, method, db, coll, headers, body
    endpoints: {
        "api": {
            "masterbusIOT": {
                "users": (req, res) => {
                    switch (req.method) {
                        case "POST":
                            // code block
                            break;
                        case "GET":
                            if (!req.headers['acces-token'])
                                res.status(403).send("acces-token requerido!");
                            decrypt(req.headers['acces-token'])
                                .then((token) => {
                                    if (token.role == 'root') {
                                        get("masterbusIOT", "users", req.query.query, req.query.queryOptions)
                                            .then((users) => res.send(JSON.stringify(users)))
                                            .catch((err) => res.status(500).send("acces-token formato invalido!"));
                                    } else {
                                        res.status(403).send("usuario no autorizado!");
                                    }
                                })
                                .catch((err) => res.status(500).send("acces-token formato invalido!"));
                            break;
                        default:
                            res.send("invalid http method!");
                            break;
                    }
                },
                "test": {

                }
            }
        }

    },

    workers: {
        postUsersQueue2DB: () => {
            const queueName = 'POST/' + config.usersDB + '/' + config.usersCollection;
            consume(queueName, (document) => {
                console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
                save(config.usersDB, config.usersCollection, document)
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
    }
}

const tokensCriteria = {
    "Masterbus-IOT": {
        Users: { role: "root" }, //Defino quien puede crear nuevos usuarios
        INTI: { $or: [{ role: "root" }, { role: "client" }] } //Defino quien puede leer/escribir de esta db
    },
    "bodysCriteria": {
        "Masterbus-IOT": {
            Users: { role: "root" }, //Defino quien puede crear nuevos usuarios
            INTI: { $or: [{ role: "root" }, { role: "client" }] } //Defino quien puede leer/escribir de esta db
        }
    },
    "encryptationCriteria": {

    }
}

module.exports = config