//Worker que se encarga de mover los mensajes de la cola a la bd de Mongo
const queue = require('../lib/queue');
const repo = require('../lib/repo');
const queueName = 'IncomingMessages';
const config = require('../config/config');
const messageCollectionName = config.messageCollectionName || 'ExampleCollection';

// Callback que se va a llamar cuando haya mensajes pendientes en la cola y el worker este disponible
const handleIncoming = message => {
    console.log("wRabToMdb@handleIncoming: %s", message);
    repo.save(messageCollectionName, message)
        .then(message => console.log("wRabToMdb@handleIncoming: Message saved in mongodb collection %s. Message: %s", messageCollectionName, message))
        .catch(err => console.log("wRabToMdb@handleIncoming: err in database Save: ", err))
}

queue
    .receive(queueName, handleIncoming);