const express = require('express'); // Librería de Node para armar servidores
// const router = express.Router(); // Herramientas para crear rutas de Express
const path = require('path'); // Librería para unificar los path independiente del OS en el que estamos
// const jwt = require('jsonwebtoken'); // Librería para generar webtokens
// const repo = require('../../lib/repo'); // Script que maneja las lecturas/escrituras a las db
const config = require('../../config'); // Script de configuracion general
// const crypto = require('../../lib/encryptation/encryptation'); // Script con herramientas para encriptar
// const mingo = require('mingo'); // Librería que me permite verificar si un objeto cumple con el criterio de un query
const bodyParser = require('body-parser'); // Herramienta para parsear el "cuerpo" de los requests
const morgan = require('morgan'); // Herramienta para loggear
const favicon = require('serve-favicon');

//Seteo el puerto del servidor
const setPort = (app, adn) => {
    app.set('port', config.port || 3000);
    console.log(`endpoints@setup: Puerto del servidor seteado en: ${app.get('port')}`);
};

//Marco la carpeta que voy a compartir con el frontend
const setPublicFolder = (app, adn) => {
    const publicFolderPath = path.join(__dirname, 'public');
    app.use('/public', express.static(publicFolderPath));
    console.log(`endpoints@setup: Carpeta publica ${publicFolderPath} en: /public`);
}

//Agrego todos los middlewares
const setMiddleWare = (app, adn) => {
    //Middleware:

    //"Morgan" es una herramienta para loggear
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    console.log(`endpoints@setup: 'morgan' middleware aagregado`);
    //"bodyParser" es un middleware que me ayuda a parsear los requests
    app.use(bodyParser.urlencoded());
    console.log(`endpoints@setup: 'bodyParser.urlencoded' middleware agregado`);
    app.use(bodyParser.json());
    console.log(`endpoints@setup: 'bodyParser.json' middleware agregado`);
    // Esto lo hago para devolver el favicon.ico
    //TODO: ver q es el favicon y si es necesario esto
    app.use(favicon(path.join(__dirname, '../../public/assets/icons', 'favicon.ico')));

    // Agrego una función que me devuelve la URL que me resulta cómoda
    app.use((req, res, next) => {
        req.getUrl = () => {
            const url = req.protocol + "://" + req.get('host') + req.originalUrl;
            console.log("Req URL: %s", url);
            return url;
        };
        req.getUrl();
        return next();
    });
    // TODO: SEGURIDAD, VALIDACIONES, ETC...
}

//Creo los endpoints a partid de la info que levanto del "ADN"
const setEndpoints = (app, adn) => {
    // TODO: SEGURIDAD, VALIDACIONES, ETC...
    //Endpoint genérico:
    app.all('/*', function(req, res) {

        var params = req.params[0].split('/');
        var endpoint = adn.endpoints;

        //Recorro el objeto "endpoint" con los parametros del request
        for (let index = 0; index < params.length; index++) {
            const key = params[index];
            if (key in endpoint) {
                console.log("key");
                endpoint = endpoint[key];
            } else
                break;
        }

        if (typeof(endpoint) == 'function')
            endpoint(req, res);
        else
            res.send("Endpoint inválido!");
    });
}

// app.get('/users', (req, res) => {
//     mariadb.querySQL("SELECT name FROM users", (err, result) => {
//         if (err) throw err;
//         res.end(result);
//     });
//     //res.send("La ruta /users funciona");
// });

//Configuro el servidor y endpoints
const setup = (app, adn) => {
    console.log(`endpoints@setup: starting!`);
    //console.table(adn.endpoints);
    return new Promise((resolve, reject) => {
        try {
            setPort(app, adn);
            setPublicFolder(app, adn);
            setMiddleWare(app, adn);
            setEndpoints(app, adn);

            resolve(adn);

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { setup };




//--------------------------------------------------------------------------------





// //Devuelve un objeto con la URL, Protocolo y TimeStamp del request
// function getReqInfo(req) {
//     var result = {};
//     result.serverReceivedTS = Date.now();
//     result.protocol = req.protocol;
//     result.url = req.socket.remoteAddress;
//     return result;
// }


// //-----------------------------------Endpoints de las Páginas------------------------------------------------

// //Página de login:
// router.get('/login', async(req, res) => {
//     //TODO:
// });

// //Página para visualizar la data (ruta protegida):
// router.get('/dashboard', async(req, res) => {

//     // const token = req.headers['x-acces-token'];
//     // if (!token) {
//     //     return res.status(401).json({
//     //         auth: false,
//     //         message: "No token provided."
//     //     })
//     // }

//     // const decoded = jwt.verify(token, config.jwtSecret);
//     // console.log(decoded);

//     const page = path.join(__dirname, '..', 'public/pages/index.html');
//     console.log("page: " + page);
//     res.sendFile(page);

// });

// //-----------------------------------Endpoints de las APIS---------------------------------------------------

// router.all('/api/login', async(req, res, next) => {

// });

// //Endpoint q recibe usuario y contraseña, devuelve un webtoken
// router.post('/api/login', async(req, res, next) => {
//     const { user, pass } = req.body;
//     console.log(`routes@/api/login  user:${user}`);

//     try {
//         repo.getUserData(user, pass)
//             .then((userData) => {
//                 //A: genero un webtoken firmado, con la info del usuario
//                 const token = jwt.sign(userData, config.jwtSecret, { expiresIn: Number(config.jwtDfltExpires) });
//                 res.json({ auth: true, token });
//             })
//             .catch((err) => {
//                 console.log(`routes@/api/login  error:${err}`);
//                 res.json({ auth: false, msg: err });
//             });
//     } catch (err) {
//         console.log(`routes@/api/login  error:${err}`);
//         res.json({ auth: false, msg: err });
//     }

// });

// //Recibo un mensage y lo encolo (ruta protegida)
// //TODO: agregar error handler cuando el body es un JSON invalido
// router.post('/api/post/:database/:collection', async(req, res, next) => {
//     //A: Me fijo si mando un token 
//     const hashedToken = req.headers['access-token'];
//     if (!hashedToken) res.status(403).send('access-token required!');

//     const db = req.params.database;
//     const coll = req.params.collection;

//     //A: Me fijo si el user tiene permiso para postear en esta collection
//     crypto.decodeToken(hashedToken)
//         .then((token) => {
//             if (crypto.validateToken(token, config.tokensCriteria[db][coll])) {
//                 console.log("Token valido!");
//                 //TODO: VALIDAR BODY
//                 //TODO: ESTO ES UNA CROTADA, ARREGLAR
//                 var body = req.body;
//                 if (body.pass) {
//                     body.pass = crypto.hash(body.pass)
//                         .then((hashedPass) => {
//                             body.pass = hashedPass;
//                             repo.post(db, coll, body)
//                                 //Ojo que no se guardo, se puso en la cola...
//                                 .then((post) => res.send(post))
//                                 .catch((err) => console.log(err));
//                         }).catch();
//                 } else {
//                     repo.post(db, coll, body)
//                         //Ojo que no se guardo, se puso en la cola...
//                         .then((post) => res.send(post))
//                         .catch((err) => console.log(err));
//                 }
//             } else {
//                 console.log("Token invalido!");
//                 res.status(403).send('invalid access-token!');
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).send('error decodificando token!');
//         });
// });

// //Devuelvo una lista filtrada por el query
// router.get('/api/get/:database/:collection', async(req, res, next) => {
//     const query = req.query.query || {};
//     const queryOptions = req.query.options || {};
//     const db = req.params.database;
//     const coll = req.params.collection;
//     console.log(`Routes@/api/get/${db}/${coll} query: ${query} options: ${queryOptions}`);
//     repo.get(db, coll, query, queryOptions)
//         .then(result => {
//             result = JSON.stringify(result);
//             console.log(`Routes@/api/get/${db}/${coll} query: ${JSON.stringify(req.query)}  res: ${result}`);
//             res.end(result);
//         })
//         .catch(err => {
//             console.log(`Routes@/api/get/${db}/${coll} query: ${req.query}  err: ${err}`);
//             res.end(err)
//         });
// });

// //TODO: Ver prioridades, o como diferencio un "wildcard" de un endpoin determinado
// router.all('/api/:database/:collection', async(req, res, next) => {
//     const query = req.query.query || {};
//     const queryOptions = req.query.options || {};
//     const db = req.params.database;
//     const coll = req.params.collection;
//     console.log(`Routes@/api/get/${db}/${coll} query: ${query} options: ${queryOptions}`);
//     repo.get(db, coll, query, queryOptions)
//         .then(result => {
//             result = JSON.stringify(result);
//             console.log(`Routes@/api/get/${db}/${coll} query: ${JSON.stringify(req.query)}  res: ${result}`);
//             res.end(result);
//         })
//         .catch(err => {
//             console.log(`Routes@/api/get/${db}/${coll} query: ${req.query}  err: ${err}`);
//             res.end(err)
//         });
// });

// //Devuelvo la cantidad de elementos en la collection que coinciden con el query
// router.get('/api/getCount/:database/:collection', async(req, res, next) => {
//     const query = req.query.query;
//     const queryOptions = req.query.options;
//     console.log(`Routes@/api/getCount/${req.params.collection} query: ${query} options: ${queryOptions}`);
//     repo.getCount(req.params.database, req.params.collection, query, queryOptions)
//         .then(result => {
//             result = JSON.stringify(result);
//             console.log(`Routes@/api/get/${req.params.database}/${req.params.collection} query: ${JSON.stringify(req.query)}  res: ${result}`);
//             res.end(result);
//         })
//         .catch(err => {
//             console.log(`Routes@/api/get/${req.params.database}/${req.params.collection} query: ${req.query}  err: ${err}`);
//             res.end(err)
//         });
// });

// module.exports = router;