//Worker que se encarga de mover los mensajes de la cola a la bd de Mongo

const queue = require('../lib/queue');
const repo = require('../lib/repo');
const {save} = require('../lib/mongodb/mongoDbHelpers');

const {messageCollectionName}= require('../config/config')//A: el nombre de la collection viene del archivo config/config.js

const handleIncoming = message => {
  console.log("wRabToMdb@handleIncoming: %s", message);
  
  save(messageCollectionName, message)
    .then( message=> console.log("wRabToMdb@handleIncoming: Message saved in mongodb collection %s. Message: %s",messageCollectionName, message))
    .catch( err=> console.log("wRabToMdb@handleIncoming: err in database Save: " , err))  
}

queue
    .receive('incoming', handleIncoming);