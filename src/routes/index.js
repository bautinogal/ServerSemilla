const express = require('express');
const router = express.Router();
const queue = require('../lib/queue');
const bodyParser = require('body-parser');
const repo = require('../lib/repo');
const config = require('../config/config');

//Devuelve un objeto en el que agrega URL, Protocolo y TimeStamp
function addReqInfo(message, req) {
    const timeStamp = Date.now();
    const protocol = req.protocol;
    const url = req.socket.remoteAddress;
    message.serverReceivedTS = timeStamp;
    message.protocol = protocol;
    message.url = url;
    return message;
}

//Endpoints de la pagina:
//Paginated Table
router.get('/table', async(req, res) => {
    //TODO: Muestro una pagina con una tabla paginada que muestra lo que hay en la bd
});

//Endpoints de las APIS:
//Recivo un evento y lo encolo
router.post('/api/add', bodyParser.text({ type: '*/*' }), async(req, res, next) => {
    // "addReqInfo" agrega el timeStamp, protocolo y url al objeto "message" ademas de lo q viene en el "req.body"
    const message = addReqInfo(JSON.parse(req.body), req);
    const queueName = 'IncomingMessages';
    console.log('Routes@api/add: Sending incoming request to "%s" queue. Message : %s', queueName, message);
    queue
        .send(queueName, message);
    res.end('Routes@api/add: Received ' + JSON.stringify(message));
    //TODO: mas adelante devería enviar un mensaje al cliente cuando se guardo en la bd y su ID
});

//Devuelvo una lista filtrada por el query
//TODO: revisar como recibimos la query y si no hay q mover cosas a otro lado...
router.get('/api/getlist', async(req, res, next) => {
    let query = {};
    let desde = Number(req.query.desde);
    let cantidad = Number(req.query.cantidad);
    console.log("Routes@api/getlist: Parsing query: %s", query);
    try {
        query = JSON.parse(req.query.q || "{}");
        console.log("Routes@api/getlist: Query parsed succesfully, query: %s", query);
    } catch (e) {
        console.log("Routes@api/getlist: Error parsing query: %s", req.query.q);
        return res.status(400).send("Error parsing query!");
    }
    //TODO: agregar querys mas complejos
    repo.list(config.messageCollectionName, query, desde, cantidad)
        .then(result => res.send(result))
        .catch(err => {
            console.log("err /api/getlist: ", err);
            res.send("error listado")
        });
});

module.exports = router;