const express = require('express'); // Librería de Node para armar servidores
const router = express.Router(); // Herramientas para crear rutas de Express
const path = require('path'); // Librería para unificar los path independiente del OS en el que estamos
const jwt = require('jsonwebtoken'); // Librería para generar webtokens
const repo = require('../lib/repo'); // Script que maneja las lecturas/escrituras a las db
const config = require('../config/config'); // Script de configuracion general
const crypto = require('../lib/encryptation'); // Script con herramientas para encriptar
//const { send } = require('../lib/queue');

//Devuelve un objeto con la URL, Protocolo y TimeStamp del request
//TODO: esta bien agregarle esto a los elementos de las db??
function getReqInfo(req) {
    var result = {};
    result.serverReceivedTS = Date.now();
    result.protocol = req.protocol;
    result.url = req.socket.remoteAddress;
    return result;
}

//Me aseguro que me enviaron un toquen en los headers, sino devuelvo 403 (forbiden), lo uso para rutas protegidas
const ensureToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    console.log(`Routes@ensureToken bearerHeader: ${bearerHeader} `);
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")[1];
        req.token = bearer;
        next();
    } else {
        send.sendStatus(403);
    }
}

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

//Endpoints de las APIS:

//Endpoint para crear un nuevo usuario
//TODO: VALIDACIONES, LO HICE RAPIDO PARA QUE ANDE NOMAS
router.post('/api/newUser', async(req, res, next) => {

    var user = req.body;

    try {
        user.salt = await crypto.getSalt();
        user.password = await crypto.hash(user.password, user.salt);
        user.user = user.email;
        console.log(`routes@/api/newUser  user:${user.email}, pass:${user.password}`);
        const reqInfo = getReqInfo(req);
        repo.newUser(user, reqInfo)
            .then((userData) => {  
                res.send('Usuario '+user.email + ' guardado');              
            });

    } catch (err) {
        console.log(`routes@/api/newUser  error:${err}`);
        res.status(500);
     }

});


//Endpoint q recibe usuario y contraseña, devuelve un webtoken
router.post('/api/login', async(req, res, next) => {
    const { email, password } = req.body;

    var user = {
        email,
        password
    }

    try {
        user.password = await crypto.hash(user.password);
        console.log(`routes@/api/login  user:${user.email}, pass:${user.password}`);
        //TODO: revisar el codigo de error
        repo.getUserData(user.email, user.password)
            .then((userData) => {
                const token = jwt.sign(userData,
                    config.jwtSecret, {
                        expiresIn: config.jwtDfltExpires
                    });
                res.json({ auth: true, token });
            })
            .catch((err)=>{
                console.log(`routes@/api/login  error:${err}`);
                //res.status(403).json({ auth: false, msg: err });
                //TODO: Ver por que no devuelve mensaje en err
                res.json({ auth: false, msg: err });
            });

    } catch (err) {  
        console.log(`routes@/api/login  error:${err}`);
        //res.status(403).json({ auth: false, msg: err });
        //TODO: Ver por que no devuelve mensaje en err
        res.json({ auth: false, msg: err });  
    }

});

//Recibo un mensage y lo encolo
//TODO: agregar error handler cuando el body es un JSON invalido
router.post('/api/post/:database/:collection', async(req, res, next) => {
    //verifico que el token sea valido para esta ruta
    jwt.verify(req.token, 'my_secret_key', (err, data) => {
        if (!err) {
            res.sendStatus(403);
        } else {
            const db = req.params.database;
            const coll = req.params.collection;
            // "addReqInfo" agrega el timeStamp, protocolo y url al objeto "message" ademas de lo q viene en el "req.body"
            var reqInfo = getReqInfo(req);
            console.log(`Routes@/api/post/${db}/${coll} body: ${JSON.stringify(req.body)} reqInfo: ${JSON.stringify(reqInfo)})`);
            repo.post(db, coll, req.body, reqInfo);
            res.end('Routes@api/add: Received ' + JSON.stringify(req.body));
            //TODO: mas adelante debería enviar un mensaje al cliente cuando se guardo en la bd y su ID
        }
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

//Devuelvo la cantidad de elementos en la collection que coinciden con el query
router.get('/api/getCount/:database/:collection', async(req, res, next) => {
    const query = req.query.query;
    const queryOptions = req.query.options;
    console.log(`Routes@/api/getCount/${req.params.collection} query: ${query} options: ${queryOptions}`);
    repo.getCount(req.params.collection, query, queryOptions)
        .then(result => {
            result = JSON.stringify(result);
            console.log(`Routes@/api/get/${req.params.collection} query: ${JSON.stringify(req.query)}  res: ${result}`);
            res.end(result);
        })
        .catch(err => {
            console.log(`Routes@/api/get/${req.params.collection} query: ${req.query}  err: ${err}`);
            res.end(err)
        });
});

module.exports = router;