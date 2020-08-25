const express = require('express'); // Librería de Node para armar servidores
const router = express.Router(); // Herramientas para crear rutas de Express
const path = require('path'); // Librería para unificar los path independiente del OS en el que estamos
const jwt = require('jsonwebtoken'); // Librería para generar webtokens
const repo = require('../lib/repo'); // Script que maneja las lecturas/escrituras a las db
const config = require('../config/envVars'); // Script de configuracion general
const crypto = require('../lib/encryptation'); // Script con herramientas para encriptar
const mingo = require('mingo'); // Librería que me permite verificar si un objeto cumple con el criterio de un query

//Devuelve un objeto con la URL, Protocolo y TimeStamp del request
function getReqInfo(req) {
    var result = {};
    result.serverReceivedTS = Date.now();
    result.protocol = req.protocol;
    result.url = req.socket.remoteAddress;
    return result;
}

const decodeToken = (hashedToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(hashedToken, config.jwtSecret, (err, decoded) => {
            if (err) {
                reject('Error decodificando token! ' + err);
            } else {
                resolve(decoded);
            }
        });
    })
}

//Ver si el token recibido cumple con la "criteria"
//TODO: VER SI ESTA BIEN USAR ESTE TIPO DE FILTRO (TIPO QUERY DE MONGO USANDO "MINGO")
const validateToken = (token, criteria) => {
    //TODO: validar "criteria"...
    // creo un query con el criterio
    let query = new mingo.Query(criteria);
    // veo si el token cumple con el criterio
    return query.test(token);
}

//-----------------------------------Endpoints de las Páginas------------------------------------------------

//Página de login:
router.get('/login', async(req, res) => {
    //TODO:
});

//Página para visualizar la data (ruta protegida):
router.get('/dashboard', async(req, res) => {

    const token = req.headers['x-acces-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: "No token provided."
        })
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    console.log(decoded);

    const page = path.join(__dirname, '..', 'public/dashboard/dashboard.html');
    console.log("page: " + page);
    res.sendFile(page);

});

//-----------------------------------Endpoints de las APIS---------------------------------------------------

router.all('/api/login', async(req, res, next) => {

});

//Endpoint q recibe usuario y contraseña, devuelve un webtoken
router.post('/api/login', async(req, res, next) => {
    const { user, pass } = req.body;
    console.log(`routes@/api/login  user:${user}`);

    try {
        repo.getUserData(user, pass)
            .then((userData) => {
                //A: genero un webtoken firmado, con la info del usuario
                const token = jwt.sign(userData, config.jwtSecret, { expiresIn: Number(config.jwtDfltExpires) });
                res.json({ auth: true, token });
            })
            .catch((err) => {
                console.log(`routes@/api/login  error:${err}`);
                res.json({ auth: false, msg: err });
            });
    } catch (err) {
        console.log(`routes@/api/login  error:${err}`);
        res.json({ auth: false, msg: err });
    }

});

//Recibo un mensage y lo encolo (ruta protegida)
//TODO: agregar error handler cuando el body es un JSON invalido
router.post('/api/post/:database/:collection', async(req, res, next) => {
    //A: Me fijo si mando un token 
    const hashedToken = req.headers['access-token'];
    if (!hashedToken) res.status(403).send('access-token required!');

    const db = req.params.database;
    const coll = req.params.collection;

    //A: Me fijo si el user tiene permiso para postear en esta collection
    decodeToken(hashedToken)
        .then((token) => {
            if (validateToken(token, config.tokensCriteria[db][coll])) {
                console.log("Token valido!");
                //TODO: VALIDAR BODY
                //TODO: ESTO ES UNA CROTADA, ARREGLAR
                var body = req.body;
                if (body.pass) {
                    body.pass = crypto.hash(body.pass)
                        .then((hashedPass) => {
                            body.pass = hashedPass;
                            repo.post(db, coll, body)
                                //Ojo que no se guardo, se puso en la cola...
                                .then((post) => res.send(post))
                                .catch((err) => console.log(err));
                        }).catch();
                } else {
                    repo.post(db, coll, body)
                        //Ojo que no se guardo, se puso en la cola...
                        .then((post) => res.send(post))
                        .catch((err) => console.log(err));
                }
            } else {
                console.log("Token invalido!");
                res.status(403).send('invalid access-token!');
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('error decodificando token!');
        });
});

//Devuelvo una lista filtrada por el query
router.get('/api/get/:database/:collection', async(req, res, next) => {
    const query = req.query.query || {};
    const queryOptions = req.query.options || {};
    const db = req.params.database;
    const coll = req.params.collection;
    console.log(`Routes@/api/get/${db}/${coll} query: ${query} options: ${queryOptions}`);
    repo.get(db, coll, query, queryOptions)
        .then(result => {
            result = JSON.stringify(result);
            console.log(`Routes@/api/get/${db}/${coll} query: ${JSON.stringify(req.query)}  res: ${result}`);
            res.end(result);
        })
        .catch(err => {
            console.log(`Routes@/api/get/${db}/${coll} query: ${req.query}  err: ${err}`);
            res.end(err)
        });
});

//TODO: Ver prioridades, o como diferencio un "wildcard" de un endpoin determinado
router.all('/api/:database/:collection', async(req, res, next) => {
    const query = req.query.query || {};
    const queryOptions = req.query.options || {};
    const db = req.params.database;
    const coll = req.params.collection;
    console.log(`Routes@/api/get/${db}/${coll} query: ${query} options: ${queryOptions}`);
    repo.get(db, coll, query, queryOptions)
        .then(result => {
            result = JSON.stringify(result);
            console.log(`Routes@/api/get/${db}/${coll} query: ${JSON.stringify(req.query)}  res: ${result}`);
            res.end(result);
        })
        .catch(err => {
            console.log(`Routes@/api/get/${db}/${coll} query: ${req.query}  err: ${err}`);
            res.end(err)
        });
});

//Devuelvo la cantidad de elementos en la collection que coinciden con el query
router.get('/api/getCount/:database/:collection', async(req, res, next) => {
    const query = req.query.query;
    const queryOptions = req.query.options;
    console.log(`Routes@/api/getCount/${req.params.collection} query: ${query} options: ${queryOptions}`);
    repo.getCount(req.params.database, req.params.collection, query, queryOptions)
        .then(result => {
            result = JSON.stringify(result);
            console.log(`Routes@/api/get/${req.params.database}/${req.params.collection} query: ${JSON.stringify(req.query)}  res: ${result}`);
            res.end(result);
        })
        .catch(err => {
            console.log(`Routes@/api/get/${req.params.database}/${req.params.collection} query: ${req.query}  err: ${err}`);
            res.end(err)
        });
});

module.exports = router;