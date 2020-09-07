const views = require('./views');

const endpoints = {
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

module.exports = endpoints;