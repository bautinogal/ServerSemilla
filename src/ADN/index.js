const path = require('path');
const {
    // login,
    // createUser,
    // deleteUsers,
    createJWT,
    cmd,
    decodeJWT,
    validate,
    encrypt,
    isOnlySubscribedURL,
    validContent,
    setUTCTimezoneTo,
    suscribeToWebhook,
    deleteOneWebhook,
    updateOneWebhook,
    fetchToWebhook,
    fetchToSubscriber,
    compareEncrypted
} = require('./lib');
var requireFromUrl = require('require-from-url/sync');
const views = requireFromUrl("https://ventumdashboard2.s3.amazonaws.com/index.js");

//------------------------------------- Objetos Específicos de la APP ----------------------------------

const login = (user, pass) => {
    var findUserCmd = {
        type: "mongo",
        method: "GET",
        db: "users",
        collection: "users",
        query: { user: user }
    };

    return new Promise((res, rej) => {
        var result = {};
        cmd(findUserCmd)
            .then(founds => {
                if (!founds) rej("lib@login: Error looking for user %s in db!", user);
                else if (founds.length == 0) rej("lib@login: No user found with: %s!", user);
                else if (founds.length > 1) rej("lib@login: More than one user found with: %s", user);
                else {
                    result = founds[0];
                    return compareEncrypted(pass, result.pass);
                }
            })
            .then(correct => {
                if (correct) {
                    delete result.pass;
                    return createJWT(result);
                } else
                    rej("lib@login: Incorrect Password!");
            })
            .then(JWT => res(JWT))
            .catch(err => rej(err));
    });
};

const createUsers = () => {

    const createUser = (data) => {
        var createUserCmd = {
            type: "mongo",
            method: "POST",
            db: "users",
            collection: "users",
            content: data
        };

        return new Promise((res, rej) => {
            if (validate(createUserCmd.content, {
                    $and: [
                        { "user": { $type: "string" } },
                        { "pass": { $type: "string" } },
                        { "role": { $type: "string" } }
                    ]
                })) {
                encrypt(createUserCmd.content.pass)
                    .then(hashedPass => {
                        createUserCmd.content.pass = hashedPass;
                        return cmd(createUserCmd);
                    })
                    .then(() => res())
                    .catch(err => rej(err));
            } else {
                rej("lib@createUser: new user must have fields: 'user', 'pass' and 'role'");
            }
        });
    };
    const deleteUsers = (query, queryOptions) => {
        var deleteUsersCmd = {
            type: "mongo",
            method: "DELETE",
            db: "users",
            collection: "users",
            query: query,
            queryOptions: queryOptions
        };

        return cmd(deleteUsersCmd);
    };
    return new Promise((res, rej) => {
        console.log("Creating users...");
        deleteUsers({}) //Borró todos los usuarios viejos
            .then(() => createUser({ user: "Admin", pass: "123456", role: "admin" }))
            .then(() => createUser({ user: "INTI", pass: "INTI-MB", role: "client" }))
            .then(() => createUser({ user: "URBE", pass: "URBE-MB", role: "client" }))
            .then(() => createUser({ user: "LEO", pass: "LEO-MB", role: "client" }))
            .then(() => res())
            .catch(err => {
                rej(err);
                console.log("Creating failed: " + err);
            });
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

        const urbetrack = () => {
            return {
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
                                            fetchPath: "/api/aggregate/admin/Events",
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
                                                                var: "Fecha",
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
                                                                var: "Fecha",
                                                                op: "$lte",
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
                                            headerBtns: {
                                                0: {
                                                    enabled: "true",
                                                    type: "filter",
                                                    label: "Filtrar ",
                                                    onClick: {
                                                        cmds: {
                                                            0: {
                                                                type: "filter",
                                                                payload: {}
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            finalStages: {
                                                0: '{"$sort":{"Fecha":-1}}'
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
        }

        const inti = () => {
            return {
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
                                            fetchPath: "/api/aggregate/admin/INTI",
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
                                            headerBtns: {
                                                0: {
                                                    enabled: "true",
                                                    type: "filter",
                                                    label: "Filtrar ",
                                                    onClick: {
                                                        cmds: {
                                                            0: {
                                                                type: "filter",
                                                                payload: {}
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            footerBtns: {
                                                0: {
                                                    enabled: false,
                                                    type: "filter",
                                                    label: "filtrar",
                                                    onClick: {
                                                        cmds: {
                                                            0: {
                                                                type: "filter",
                                                                payload: {}
                                                            }
                                                        }
                                                    }
                                                },
                                                1: {
                                                    enabled: "true",
                                                    type: "filter",
                                                    label: "filtrar",
                                                    onClick: {
                                                        cmds: {
                                                            0: {
                                                                type: "filter",
                                                                payload: {}
                                                            }
                                                        }
                                                    }
                                                },
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
        }

        const form = () => {

            const modalForm = {
                type: "form",
                payload: {
                    title: "Confirmación",
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
                    footerBtns: {
                        0: {
                            enabled: "false",
                            type: "filter",
                            label: "filtrar",
                            onClick: {
                                cmds: {
                                    0: {
                                        type: "filter",
                                        payload: {}
                                    }
                                }
                            }
                        },
                        1: {
                            enabled: "false",
                            type: "filter",
                            label: "filtrar",
                            onClick: {
                                cmds: {
                                    0: {
                                        type: "filter",
                                        payload: {}
                                    }
                                }
                            }
                        },
                    }
                }
            }

            const formCliente = {
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
            };

            const formReceptor = {
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
            };

            const tableEquipos = {
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
                    },
                    headerBtns: {
                        0: {
                            enabled: "true",
                            type: "filter",
                            label: "filtrar",
                            onClick: {
                                cmds: {
                                    0: {
                                        type: "filter",
                                        payload: {}
                                    }
                                }
                            }
                        },
                        1: {
                            enabled: "true",
                            type: "erase",
                            label: "filtrar",
                            targeted: true, // Solo se habilita si tengo seleccionado elementos de la tabla
                            onClick: {
                                cmds: {
                                    0: {
                                        type: "erase",
                                        payload: {}
                                    }
                                }
                            }
                        },
                        2: {
                            enabled: "true",
                            type: "edit",
                            label: "editar",
                            targeted: true, // Solo se habilita si tengo seleccionado elementos de la tabla
                            onClick: {
                                cmds: {
                                    1: {
                                        type: "modal",
                                        form: {
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
                                            },
                                            footerBtns: {
                                                cancel: {
                                                    enabled: "true",
                                                    type: "edit",
                                                    label: "editar",
                                                    onClick: {}
                                                },
                                                acept: {
                                                    enabled: "true",
                                                    type: "edit",
                                                    label: "editar",
                                                    onClick: {}
                                                }
                                            }
                                        },
                                    }
                                }
                            }
                        },
                        3: {
                            enabled: "true",
                            type: "add",
                            label: "agregar",
                            onClick: {
                                cmds: {
                                    0: {
                                        type: "modal",
                                        payload: {
                                            content: {
                                                rows: {
                                                    //Rows
                                                    0: {
                                                        cols: {
                                                            0: {
                                                                0: modalForm
                                                            }
                                                        }
                                                    }
                                                },
                                            }
                                        }
                                    },
                                    1: {
                                        type: "post",
                                        payload: {
                                            url: "api/post/test/test",
                                            method: "POST",
                                        }
                                    },
                                    2: {
                                        type: "update",
                                        payload: {}
                                    }
                                }
                            }
                        }
                    },
                    footerBtns: {
                        0: {
                            enabled: "false",
                            type: "filter",
                            label: "filtrar",
                            onClick: {
                                cmds: {
                                    0: {
                                        type: "filter",
                                        payload: {}
                                    }
                                }
                            }
                        },
                        1: {
                            enabled: "false",
                            type: "filter",
                            label: "filtrar",
                            onClick: {
                                cmds: {
                                    0: {
                                        type: "filter",
                                        payload: {}
                                    }
                                }
                            }
                        },
                    }
                }
            };

            return {
                name: "FORM",
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
                                0: {
                                    0: formCliente
                                },
                                1: {
                                    0: formReceptor
                                }
                            }
                        },
                        1: {
                            cols: {
                                0: {
                                    0: tableEquipos
                                }
                            }
                        }
                    },
                }
            }
        }

        return {
            0: urbetrack(),
            1: inti(),
            2: form()
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

    //Credenciales de Broker MQTT
    mqtt: {
        url: "ws://52.90.77.249:8083/mqtt",
        credentials: {
            username: "admin",
            password: "public"
        },
        topics: ['inti/865067021324796/start', 'inti/865067021324796/quick', 'inti/865067021324796/slow', 'testtopic']
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
        url: "mongodb://dashboard:dashboardpassword@unm-kvm-masterbus-4.planisys.net/admin",
        //url: "mongodb+srv://masterbus-iot-server:masterbus@cluster0.uggrc.mongodb.net/INTI-Test?retryWrites=true&w=majority",
        dfltDb: "dflt",
        dfltColl: "dflt"
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
                                res
                                    .cookie("access-token", JSON.stringify(token), {})
                                    .status(200)
                                    .send(`{"token":${JSON.stringify(token)}}`);
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(403).send(JSON.stringify(err));
                            });
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
                                        db: config.users.db,
                                        collection: config.users.col,
                                        query: {},
                                        queryOptions: {},
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
            var coll = params[3];
            if (coll == 'urbe') {
                coll = 'Events';
            }
            cmd({
                    type: "mongo",
                    method: "POST",
                    db: 'admin', //params[2],
                    collection: coll,
                    content: req.body
                })
                .then(() => {
                    //res.status(200).send(JSON.stringify(req.body) + " received!");
                    //Push de datos a los webhooks suscriptos (POST REQUEST).
                    //Verificar body (Si son datos para urbe, ejecutar evento).
                    return cmd({
                            type: "mongo",
                            method: "GET", //Aggregate() o GET de webhooks?
                            db: "admin",
                            collection: "Webhooks",
                            query: {},
                            queryOptions: {}
                        })
                        .then((suscribers) => {
                            let urlParams = {
                                bus: parseInt(req.body.Interno),
                                fecha: setUTCTimezoneTo(req.body.Fecha, -3)
                            };
                            let initFetch = {
                                method: "GET",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': '3d524a53c110e4c22463b10ed32cef9d'
                                }
                            };
                            for (let index = 0; index < suscribers.length; index++) {
                                const elem = suscribers[index];
                                const url = new URL(elem.content.url);
                                url.search = new URLSearchParams(urlParams);
                                const urlWithParams = url;
                                console.log(url);
                                fetchToWebhook(initFetch, urlWithParams, elem.content.codigos, req);
                            }
                        })
                        .catch(err => res.status(500).send("Error:" + err));
                })
                .catch(error => res.status(500).send(error));
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
        /*Endpoint para suscribir a webhook de Masterbus-IOT. */
        "webhook": (req, res) => {
            const params = req.params[0].split('/');
            let token = req.headers['access-token'];
            let url = req.body.url;
            let codigos = req.body.codigos;

            if (params.length < 3) {
                res.status(404).send("URL must define db in url: /api/webhooks/:database");
                return;
            };
            try {
                token.replace(/"/g, ""); // TOKEN en las cookies post-login
            } catch (error) {
                res.status(403).send("cookie: 'access-token' required!");
                return;
            }
            decodeJWT(token)
                .then((decodedToken) => {
                    switch (req.method) {
                        case "GET":
                            if (validate(decodedToken, { $or: [{ role: "admin" }] })) {
                                cmd({
                                        type: "mongo",
                                        method: "GET",
                                        db: params[2],
                                        collection: "webhooks", // Colección de los webhooks
                                        query: {},
                                        queryOptions: {}
                                    })
                                    .then((webhooksList) => {
                                        res.status(200).send(JSON.stringify(webhooksList));
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).send("Error en la validación");
                                    });
                            } else {
                                res.status(403).send("Error de validación");
                            }
                            break;
                        case "POST":
                            if (validate(decodedToken, { $or: [{ role: "client" }, { role: "admin" }] }) &&
                                validContent(req.body)) {
                                cmd({
                                        type: "mongo",
                                        method: "GET",
                                        db: params[2],
                                        collection: "webhooks", // Colección de los webhooks
                                        query: {},
                                        queryOptions: {}
                                    })
                                    .then((webhooksList) => {
                                        console.log(`req body: ${req.body}`);
                                        const body = {
                                            user: decodedToken.user,
                                            content: req.body
                                        };
                                        console.log(body);
                                        if (isOnlySubscribedURL(body.content.url, webhooksList)) {
                                            suscribeToWebhook(body, params, codigos); //SUSCRIBE A LOS EVENTOS
                                        } else if (body.content.url) {
                                            console.log(body.content.url);
                                            console.log(body);
                                            res.status(403).send("La URL " + req.body.url + " con la que intenta suscribirse ya está suscripta al sistema.");
                                        } else {
                                            console.log(body.content.url);
                                            console.log(body);
                                            res.status(403).send("Debe contener una URL en el body!");
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(403).send("Error con el query");
                                    });
                            } else {
                                res.status(403).send("Error de validación");
                            }
                            break;
                        case "DELETE":
                            let query = { "content.url": url };
                            if (validate(decodedToken, { $or: [{ role: "client" }, { role: "admin" }] })) {
                                cmd({
                                        type: "mongo",
                                        method: "GET",
                                        db: params[2],
                                        collection: "webhooks", // Colección de los webhooks
                                        query: query, //Busca si existe la URL a borrar
                                        queryOptions: {}
                                    })
                                    .then((result) => {
                                        console.log(result);
                                        if (Array.isArray(result) && result.length) {
                                            deleteOneWebhook(query, params[2]);
                                        } else {
                                            res.status(403).send("La solicitud no se pudo procesar. La URL provista no está suscripta.");
                                        }
                                    })
                                    .catch(e => console.log(e));
                            } else {
                                res.status(403).send("Error de validación")
                            }
                            break;
                        case "PUT":
                            query = { "content.url": req.body.url };
                            let updateValues = req.body.updateValues;
                            if (validate(decodedToken, { $or: [{ role: "client" }, { role: "admin" }] })) {
                                cmd({ //Se valida que la URL pasada existe en la colección con el GET.
                                        type: "mongo",
                                        method: "GET",
                                        db: params[2],
                                        collection: "webhooks", // Colección de los webhooks
                                        query: query,
                                        queryOptions: {}
                                    })
                                    .then((webhookToUpdate) => {
                                        if (Array.isArray(webhookToUpdate) && webhookToUpdate.length) {
                                            updateOneWebhook(query, updateValues, params[2]);
                                        } else {
                                            res.status(403).send("La URL " + req.body.url + " que intenta actualizar ha tenido un inconveniente.")
                                        }
                                    })

                                .catch(err => console.log(err));

                            } else {
                                res.status(403).send("Error de validación");
                            }
                            break;
                        default:
                            res.status(403).send(`¡Método invalido: ${req.method}!`);
                            break;
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).send("Incorrect token!");
                })
        }
    },
    "test": {
        "mariadb": (req, res) => {
            cmdSQLMsg = {
                type: "maria",
                method: "GET",
                query: req.body.query,
                queryValues: req.body.queryValues,
                pool: {
                    database: "SEMILLA_LOCAL",
                    host: "127.0.0.1",
                    user: "root",
                    password: "",
                    port: 3306,
                    rowsAsArray: true
                }
            }
            cmd(cmdSQLMsg)
                .then((result) => {
                    console.log(result);
                    res.status(200).send(result);
                })
                .catch(err => res.status(403).send(err));

        }
    },
    "log": (req, res) => {
        console.log(JSON.stringify(req.body));
        res.status(200).send(req.body);
    },
    "ingreso": {
        "nuevo-equipo": (req, res) => {
            console.log(JSON.stringify(req.body.inputs));
            setTimeout(() => { res.send("ok"); }, 2000);
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
        ws.send("Probando envío de datos por WebSocket Protocol.");
    }
};

const repo = {
    users: {
        db: "users",
        col: "users"
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

module.exports = { onStart, onReady, config, queues, bds, endpoints, workers, websocket, repo };