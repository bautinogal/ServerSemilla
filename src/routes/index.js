const express = require('express');
const router = express.Router();
const repo = require('../lib/repo');
const config = require('../config/config');
const utils = require('../lib/utils');
const path = require('path');

//TODO: mover a utils
function ArrayObjFilter(arrObj, filters) {
    return arrObj.map(obj => utils.objFilter(obj, filters))
}

//Devuelve un objeto con la URL, Protocolo y TimeStamp del request
function getReqInfo(req) {
    var result = {};
    result.serverReceivedTS = Date.now();
    result.protocol = req.protocol;
    result.url = req.socket.remoteAddress;
    return result;
}

//Pagina de login:
router.get('/login', async(req, res) => {
    //TODO:
});

//Pagina para visualizar la data (ruta protegida):
router.get('/dashboard', async(req, res) => {
    //1-obtener un array de datos que quiero mostrar en la tabla
    //2- formatearlo para que la tabla en la view lo pueda usar
    //3-pasarle el array en la view
    //MEJORAS:
    //1-le paso la cantidad total de documentos 
    //2-agregar paginacion
    //3-que la view redireccione a este mismo endpoint con el numero de paginacion que clickea el user

    // //1-obtener un array de datos que quiero mostrar en la tabla
    // let filters = ["serverReceived", "protocol", "url", "serverEnqueuedTS", "serverEnqueued"] //U: que keys no quiero mostrar en mi tabla
    // let headers = ['Id', 'Fecha', 'Mensaje', 'Codigo', 'Latitud', 'Logitud', 'Interno', 'Patente', 'serverReceivedTS'] //A: los titulos de la tabla que mostramos para los mensajes que nos llegaron

    // let data = await dataGet();
    // result = ArrayObjFilter(data.result, filters)
    // let messages = result.map(result => Object.values(result)) //A: array de arrays con los values del diccioonario devuelto por la base de datos para darselo a la tabla 
    // let messagesCount = data.count;
    //res.sendFile(path.join(__dirname + '/index.html'));
    // const url = path.join(__dirname + '/../views/dashboard.html');
    const page = path.join(__dirname, '..', 'public/dashboard/dashboard.html');
    console.log("page: " + page);
    res.sendFile(page);

});

//Endpoints de las APIS:

//Endpoint q recibe usuario y contraseña, devuelve un webtoken
router.post('/api/login', async(req, res, next) => {
    //TODO:
});

//Recivo un mensage y lo encolo
//TODO: agregar error handler cuando el body es un JSON invalido
router.post('/api/post/:collection', async(req, res, next) => {
    // "addReqInfo" agrega el timeStamp, protocolo y url al objeto "message" ademas de lo q viene en el "req.body"
    var reqInfo = getReqInfo(req);
    console.log(`Routes@/api/post/${req.params.collection} body: ${JSON.stringify(req.body)} reqInfo: ${JSON.stringify(reqInfo)})`);
    repo.post(req.params.collection, req.body, reqInfo);
    res.end('Routes@api/add: Received ' + JSON.stringify(req.body));
    //TODO: mas adelante devería enviar un mensaje al cliente cuando se guardo en la bd y su ID
});

//Devuelvo una lista filtrada por el query
router.get('/api/get/:collection', async(req, res, next) => {
    const query = req.query.query;
    const queryOptions = req.query.options;
    console.log(`Routes@/api/get/${req.params.collection} query: ${query} options: ${queryOptions}`);
    repo.get(req.params.collection, query, queryOptions)
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

//Devuelvo la cantidad de elementos en la collection que coinciden con el query
router.get('/api/getCount/:collection', async(req, res, next) => {
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