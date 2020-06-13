//Worker que se encarga de mover los mensajes de la cola a la bd de Mongo

const queue = require('../lib/queue');
const repo = require('../lib/repo');

const handleIncoming = message => {
    console.log("wRabToMdb@handleIncoming: %s", message);
    repo
        .create(message)
        .then(record => {
            console.log("wRabToMdb@handleIncoming: Message saved in mongodb collection 'incoming'. Message: %s", message);
        });
}

queue
    .receive('incoming', handleIncoming);