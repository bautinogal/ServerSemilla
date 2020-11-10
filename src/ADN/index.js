const path = require('path');
const { login, createUser, deleteUsers, cmd, cmds, enqueue, encrypt, compareEncrypted, createJWT, decodeJWT, copyFile, copyFolder, validate } = require('./lib');
var requireFromUrl = require('require-from-url/sync');
const views = requireFromUrl("https://ventumdashboard.s3.amazonaws.com/index.js");

//------------------------------------- Objetos Específicos de la APP ----------------------------------

const createUsers = () => {
    return new Promise((res, rej) => {
        deleteUsers({}) //Borró todos los usuarios viejos
            .then(() => createUser({ user: "Admin", pass: "123456", role: "admin" }))
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
                    if (validate(token, criteria)) {
                        console.log(`${token.user} with ${token.role} role, logged in!`);
                        resolve(token);
                    } else
                        console.log(`${token.user} with ${token.role} role, failed to logged in!`);
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
const getDashboardData = (token) => {

    var getCategories = () => {

        var urbetrack = {
            name: "URBETRACK",
            access: {
                names: {
                    0: "URBE",
                    1: "Admin"
                },
                roles: {
                    0: "Admin"
                }
            },
            content: {
                rows: {
                    //Rows
                    0: {
                        cols: {
                            //Columns
                            0: {
                                //Columns elements
                                0: {
                                    type: "table",
                                    payload: {
                                        title: "URBETRACK",
                                        fetchPath: "/api/aggregate/Masterbus-IOT/urbe",
                                        headers: {
                                            0: {
                                                name: "Fecha",
                                                label: "Fecha",
                                            },
                                            1: {
                                                name: "Mensaje",
                                                label: "Mensaje",
                                            },
                                            2: {
                                                name: "Codigo",
                                                label: "Código",
                                            },
                                            3: {
                                                name: "Latitud",
                                                label: "Latitud",
                                            },
                                            4: {
                                                name: "Longitud",
                                                label: "Longitud",
                                            },
                                            5: {
                                                name: "Interno",
                                                label: "Interno",
                                            },
                                            6: {
                                                name: "Patente",
                                                label: "Patente",
                                            },
                                        },
                                        filters: {
                                            0: {
                                                label: "Desde",
                                                inputs: {
                                                    desde: {
                                                        name: "fecha-desde",
                                                        type: "date",
                                                        placeholder: "Desde",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Fecha",
                                                            op: "$gte",
                                                            transform: "date"
                                                        }
                                                    }
                                                }
                                            },
                                            1: {
                                                label: "Hasta",
                                                inputs: {
                                                    desde: {
                                                        name: "fecha-hasta",
                                                        type: "date",
                                                        placeholder: "Hasta",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Fecha",
                                                            op: "$gte",
                                                            transform: "date"
                                                        }
                                                    }
                                                }
                                            },
                                            2: {
                                                label: "Código",
                                                inputs: {
                                                    desde: {
                                                        name: "codigo",
                                                        type: "text",
                                                        placeholder: "Código",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "Codigo",
                                                        }
                                                    }
                                                }
                                            },
                                            3: {
                                                label: "Interno",
                                                inputs: {
                                                    desde: {
                                                        name: "interno",
                                                        type: "text",
                                                        placeholder: "Interno",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "Interno",
                                                        }
                                                    }
                                                }
                                            },
                                            4: {
                                                label: "Patente",
                                                inputs: {
                                                    desde: {
                                                        name: "patente",
                                                        type: "text",
                                                        placeholder: "Patente",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "Patente",
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        finalStages: {
                                            0: '{"$sort":{"paquete.Fecha":-1,"paquete.Hora":-1}}'
                                        },
                                        footerButtons: {
                                            add: {
                                                label: "Agregar",
                                                type: "add",
                                                modal: {
                                                    type: "form",
                                                    msg: "",
                                                    title: "Modal Form",
                                                    cols: {
                                                        0: {
                                                            0: {
                                                                type: "text",
                                                                label: "DNI",
                                                                placeholder: "DNI"
                                                            },
                                                            1: {
                                                                type: "text",
                                                                label: "Nombre",
                                                                placeholder: "Nombre"
                                                            },
                                                            2: {
                                                                type: "text",
                                                                label: "Apellido",
                                                                placeholder: "Apellido"
                                                            },
                                                            3: {
                                                                type: "date",
                                                                label: "Fecha N.",
                                                                placeholder: ""
                                                            },
                                                            4: {
                                                                type: "text",
                                                                label: "Empresa",
                                                                placeholder: "Empresa"
                                                            },
                                                        },
                                                        1: {
                                                            0: {
                                                                type: "text",
                                                                label: "Sector",
                                                                placeholder: "Sector"
                                                            },
                                                            1: {
                                                                type: "text",
                                                                label: "Posición",
                                                                placeholder: "Posición"
                                                            },
                                                            2: {
                                                                type: "text",
                                                                label: "Mail",
                                                                placeholder: "Mail"
                                                            },
                                                            3: {
                                                                type: "text",
                                                                label: "Teléfono",
                                                                placeholder: ""
                                                            },
                                                            4: {
                                                                type: "text",
                                                                label: "Dirección",
                                                                placeholder: "Dirección"
                                                            },
                                                        }
                                                    },
                                                    onConfirm: {

                                                    }
                                                }
                                            },
                                            finish: {
                                                label: "Finalizar",
                                                type: "submit",
                                                modal: {
                                                    type: "confirm",
                                                    msg: "Esta seguro que desea cargar estos datos?",
                                                    onConfirm: {

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        }

        var inti = {
            name: "INTI",
            access: {
                names: {
                    0: "INTI",
                    1: "Admin"
                },
                roles: {
                    0: "Admin"
                }
            },
            content: {
                rows: {
                    //Rows
                    0: {
                        cols: {
                            //Columns
                            0: {
                                //Columns elements
                                0: {
                                    type: "table",
                                    payload: {
                                        title: "INTI",
                                        fetchPath: "/api/aggregate/Masterbus-IOT/INTI",
                                        headers: {
                                            0: {
                                                name: "paquete.Direccion",
                                                label: "Dirección",
                                            },
                                            1: {
                                                name: "paquete.ID",
                                                label: "ID",
                                            },
                                            2: {
                                                name: "paquete.Fecha",
                                                label: "Fecha",
                                            },
                                            3: {
                                                name: "paquete.Hora",
                                                label: "Hora",
                                            },
                                            4: {
                                                name: "paquete.Latitud",
                                                label: "Latitud",
                                            },
                                            5: {
                                                name: "paquete.Longitud",
                                                label: "Longitud",
                                            },
                                            6: {
                                                name: "paquete.Sensor1",
                                                label: "Comb.(S1)",
                                            },
                                            7: {
                                                name: "paquete.Sensor2",
                                                label: "RPMs (S2)",
                                            },
                                            8: {
                                                name: "paquete.Accel",
                                                label: "Aceleración",
                                            },
                                            9: {
                                                name: "paquete.Velocidad",
                                                label: "Velocidad",
                                            }
                                        },
                                        filters: {
                                            0: {
                                                label: "Desde",
                                                inputs: {
                                                    desde: {
                                                        name: "fecha-desde",
                                                        type: "date",
                                                        placeholder: "Desde",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Fecha",
                                                            op: "$gte",
                                                            transform: "date"
                                                        }
                                                    }
                                                }
                                            },
                                            1: {
                                                label: "Hasta",
                                                inputs: {
                                                    desde: {
                                                        name: "fecha-hasta",
                                                        type: "date",
                                                        placeholder: "Hasta",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Fecha",
                                                            op: "$lte",
                                                            transform: "date"
                                                        }
                                                    }
                                                }
                                            },
                                            2: {
                                                label: "ID",
                                                inputs: {
                                                    desde: {
                                                        name: "ID",
                                                        type: "text",
                                                        placeholder: "ID",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.ID",
                                                        }
                                                    }
                                                }
                                            },
                                            3: {
                                                label: "Aceleración",
                                                inputs: {
                                                    desde: {
                                                        name: "aceleracion-desde",
                                                        type: "text",
                                                        placeholder: "Desde",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Accel",
                                                            op: "$gte",
                                                        }
                                                    },
                                                    hasta: {
                                                        name: "aceleracion-hasta",
                                                        type: "text",
                                                        placeholder: "Hasta",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Accel",
                                                            op: "$lte",
                                                        }
                                                    }
                                                }
                                            },
                                            4: {
                                                label: "Velocidad",
                                                inputs: {
                                                    desde: {
                                                        name: "velocidad-desde",
                                                        type: "number",
                                                        placeholder: "Desde",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Velocidad",
                                                            op: "$gte",
                                                        }
                                                    },
                                                    hasta: {
                                                        name: "velocidad-hasta",
                                                        type: "number",
                                                        placeholder: "Hasta",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Velocidad",
                                                            op: "$lte",
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        finalStages: {
                                            0: '{"$sort":{"paquete.Fecha":-1,"paquete.Hora":-1}}'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        }

        var form = {
            name: "Form",
            access: {
                names: {
                    1: "Admin"
                },
                roles: {
                    0: "Admin"
                }
            },
            content: {
                rows: {
                    //Rows
                    0: {
                        cols: {
                            //Columns
                            0: {
                                //Columns elements
                                0: {
                                    type: "form",
                                    payload: {
                                        title: "INTI",
                                        cols: {
                                            0: {
                                                0: {
                                                    type: "text",
                                                    label: "DNI",
                                                    placeholder: "DNI"
                                                },
                                                1: {
                                                    type: "text",
                                                    label: "Nombre",
                                                    placeholder: "Nombre"
                                                },
                                                2: {
                                                    type: "text",
                                                    label: "Apellido",
                                                    placeholder: "Apellido"
                                                },
                                                3: {
                                                    type: "date",
                                                    label: "Fecha N.",
                                                    placeholder: ""
                                                },
                                                4: {
                                                    type: "text",
                                                    label: "Empresa",
                                                    placeholder: "Empresa"
                                                },
                                            },
                                            1: {
                                                0: {
                                                    type: "text",
                                                    label: "Sector",
                                                    placeholder: "Sector"
                                                },
                                                1: {
                                                    type: "text",
                                                    label: "Posición",
                                                    placeholder: "Posición"
                                                },
                                                2: {
                                                    type: "text",
                                                    label: "Mail",
                                                    placeholder: "Mail"
                                                },
                                                3: {
                                                    type: "text",
                                                    label: "Teléfono",
                                                    placeholder: ""
                                                },
                                                4: {
                                                    type: "text",
                                                    label: "Dirección",
                                                    placeholder: "Dirección"
                                                },
                                            }
                                        }
                                    }
                                }
                            },
                            1: {
                                //Columns elements
                                0: {
                                    type: "form",
                                    payload: {
                                        title: "INTI",
                                        cols: {
                                            0: {
                                                0: {
                                                    type: "text",
                                                    label: "DNI",
                                                    placeholder: "DNI"
                                                },
                                                1: {
                                                    type: "text",
                                                    label: "Nombre",
                                                    placeholder: "Nombre"
                                                },
                                                2: {
                                                    type: "text",
                                                    label: "Apellido",
                                                    placeholder: "Apellido"
                                                },
                                                3: {
                                                    type: "date",
                                                    label: "Fecha N.",
                                                    placeholder: ""
                                                },
                                                4: {
                                                    type: "text",
                                                    label: "Empresa",
                                                    placeholder: "Empresa"
                                                },
                                            },
                                            1: {
                                                0: {
                                                    type: "text",
                                                    label: "Sector",
                                                    placeholder: "Sector"
                                                },
                                                1: {
                                                    type: "text",
                                                    label: "Posición",
                                                    placeholder: "Posición"
                                                },
                                                2: {
                                                    type: "text",
                                                    label: "Mail",
                                                    placeholder: "Mail"
                                                },
                                                3: {
                                                    type: "text",
                                                    label: "Teléfono",
                                                    placeholder: ""
                                                },
                                                4: {
                                                    type: "text",
                                                    label: "Dirección",
                                                    placeholder: "Dirección"
                                                },
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    1: {
                        cols: {
                            //Columns
                            0: {
                                //Columns elements
                                0: {
                                    type: "table",
                                    payload: {
                                        title: "INTI",
                                        fetchPath: "/api/aggregate/Masterbus-IOT/INTI",
                                        headers: {
                                            0: {
                                                name: "paquete.Direccion",
                                                label: "Dirección",
                                            },
                                            1: {
                                                name: "paquete.ID",
                                                label: "ID",
                                            },
                                            2: {
                                                name: "paquete.Fecha",
                                                label: "Fecha",
                                            },
                                            3: {
                                                name: "paquete.Hora",
                                                label: "Hora",
                                            },
                                            4: {
                                                name: "paquete.Latitud",
                                                label: "Latitud",
                                            },
                                            5: {
                                                name: "paquete.Longitud",
                                                label: "Longitud",
                                            },
                                            6: {
                                                name: "paquete.Sensor1",
                                                label: "Comb.(S1)",
                                            },
                                            7: {
                                                name: "paquete.Sensor2",
                                                label: "RPMs (S2)",
                                            },
                                            8: {
                                                name: "paquete.Accel",
                                                label: "Aceleración",
                                            },
                                            9: {
                                                name: "paquete.Velocidad",
                                                label: "Velocidad",
                                            }
                                        },
                                        filters: {
                                            0: {
                                                label: "Desde",
                                                inputs: {
                                                    desde: {
                                                        name: "fecha-desde",
                                                        type: "date",
                                                        placeholder: "Desde",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Fecha",
                                                            op: "$gte",
                                                            transform: "date"
                                                        }
                                                    }
                                                }
                                            },
                                            1: {
                                                label: "Hasta",
                                                inputs: {
                                                    desde: {
                                                        name: "fecha-hasta",
                                                        type: "date",
                                                        placeholder: "Hasta",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Fecha",
                                                            op: "$lte",
                                                            transform: "date"
                                                        }
                                                    }
                                                }
                                            },
                                            2: {
                                                label: "ID",
                                                inputs: {
                                                    desde: {
                                                        name: "ID",
                                                        type: "text",
                                                        placeholder: "ID",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.ID",
                                                        }
                                                    }
                                                }
                                            },
                                            3: {
                                                label: "Aceleración",
                                                inputs: {
                                                    desde: {
                                                        name: "aceleracion-desde",
                                                        type: "text",
                                                        placeholder: "Desde",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Accel",
                                                            op: "$gte",
                                                        }
                                                    },
                                                    hasta: {
                                                        name: "aceleracion-hasta",
                                                        type: "text",
                                                        placeholder: "Hasta",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Accel",
                                                            op: "$lte",
                                                        }
                                                    }
                                                }
                                            },
                                            4: {
                                                label: "Velocidad",
                                                inputs: {
                                                    desde: {
                                                        name: "velocidad-desde",
                                                        type: "number",
                                                        placeholder: "Desde",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Velocidad",
                                                            op: "$gte",
                                                        }
                                                    },
                                                    hasta: {
                                                        name: "velocidad-hasta",
                                                        type: "number",
                                                        placeholder: "Hasta",
                                                        value: "",
                                                        required: "",
                                                        stage: {
                                                            type: "match",
                                                            var: "paquete.Velocidad",
                                                            op: "$lte",
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        finalStages: {
                                            0: '{"$sort":{"paquete.Fecha":-1,"paquete.Hora":-1}}'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        }

        return {
            0: urbetrack,
            1: inti,
            2: form
        }
    }

    return {
        id: "id",
        company: {
            name: "Masterbus"
        },
        user: {
            name: token.user,
            role: token.role,
        },
        categories: getCategories()
    };
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

    // maria: {
    //     pool: {
    //         database: "SEMILLA_LOCAL",
    //         host: "127.0.0.1",
    //         user: "root",
    //         password: "",
    //         port: 3306,
    //         rowsAsArray: true
    //     }
    // }
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
                    .then((token) => views.dashboard(req, res, getDashboardData(token)))
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
                            login(user, pass) //CHEQUEAR SI HAY EXPRESIONES INESPERADAS.
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
                                            type: "maria",
                                            method: "GET",
                                            db: config.users.db,
                                            collection: config.users.col,
                                            query: "SELECT * FROM users",
                                            queryValues: "",
                                            pool: {
                                                database: "SEMILLA_LOCAL",
                                                host: "127.0.0.1",
                                                user: "root",
                                                password: "",
                                                port: 3306,
                                                rowsAsArray: true
                                            }
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
                        //mandar a los webhook subscriptos
                        res.status(200).send(JSON.stringify(req.body) + " received!");
                    })
                    .catch(err => res.status(500).send(err));
            },
            "get": (req, res) => {
                var params = req.params[0].split('/');
                var bd = params[2];
                var col = params[3];
                checkAccessToken(req, res, { $or: [{ role: "client" }, { role: "admin" }] })
                    .then((token) => {
                        switch (req.method) {
                            case "GET":
                                var result = {};
                                console.log("req.query.queryOptions: " + req.query.queryOptions);
                                cmd({
                                        type: "mongo",
                                        method: "GET",
                                        db: bd,
                                        collection: col,
                                        query: req.query.query,
                                        queryOptions: req.query.queryOptions
                                    })
                                    .then(results => {
                                        console.log("Results: " + JSON.stringify(results));
                                        result.rows = results;
                                        return cmd({
                                            type: "mongo",
                                            method: "COUNT",
                                            db: bd,
                                            collection: col,
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
                var params = req.params[0].split('/');
                var bd = params[2];
                var col = params[3];
                cmd({
                        type: "mongo",
                        method: "AGGREGATE",
                        db: bd,
                        collection: col,
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
            },
            "webhook": (req, res) => { //Endpoint para suscribirnos a un evento
                //api/webhook/Masterbus-IOT/urbetrack/
                //BODY: {url: "laurlenlaqquierenrecibir", codigos:["910","920"]}
                //TODO: Valido el req.header.token
                var tokenValido = true;
                if (tokenValido) {
                    var params = req.params[0].split('/');
                    //TODO: Validar body url y codigos 
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
                } else {
                    res.send(403).send("Error validando el token");
                }
            }
        }
    },

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
        ws.send("Probando envío de datos por WebSocket Protocol.");
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