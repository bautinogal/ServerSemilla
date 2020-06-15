const express = require('express');
const router = express.Router();
const queue = require('../lib/queue');
const bodyParser = require('body-parser');
const repo = require('../lib/repo');
const config = require('../config/config');

//---------------------------------------------------------------------
//S: lib
//TODO: mover a lib o utils
function objFilter(obj, filters){ //U:recibe los filters para limpiar el obj pasado como parametro
  let newObj={};
  for( let key in  obj){
    if(!filters.includes(key))
      newObj[key]= obj[key]
  }
  return newObj;
}

function ArrayObjFilter( arrObj, filters ){
  return arrObj.map( obj=> objFilter(obj, filters))
}


//--------------------------------------------------------------------
//S: functions

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

function dataGet(){
  return new Promise((resolve,reject)=>{
    repo.list(config.messageCollectionName)
      .then(result => resolve(result))
      .catch(err => {
          console.log("err /api/getlist: ", err);
          reject(err)
      });
  })
}



//Endpoints de la pagina:
//Paginated Table
router.get('/table', async(req, res) => {
  //1-obtener un array de datos que quiero mostrar en la tabla
  //2- formatearlo para que la tabla en la view lo pueda usar
  //3-pasarle el array en la view
  //MEJORAS:
  //1-le paso la cantidad total de documentos 
  //2-agregar paginacion
  //3-que la view redireccione a este mismo endpoint con el numero de paginacion que clickea el user

  //1-obtener un array de datos que quiero mostrar en la tabla
  let filters= ["serverReceivedTS", "protocol", "url", "serverEnqueuedTS"]//U: que keys no quiero mostrar en mi tabla
  let headers= ['Id' , 'Fecha', 'Mensaje', 'Codigo', 'Latitud', 'Logitud', 'Interno', 'Patente'] //A: los titulos de la tabla que mostramos para los mensajes que nos llegaron
  
  let data= await dataGet();
  result= ArrayObjFilter(data.result, filters)
  let messages= result.map( result => Object.values(result)) //A: array de arrays con los values del diccioonario devuelto por la base de datos para darselo a la tabla 
  let messagesCount= data.count;
  res.render('messageTable',{rows: messages, messagesCount, headers})

});

//Endpoints de las APIS:
//Recivo un evento y lo encolo
//TODO: agregar error handler cuando el body es un JSON invalido
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