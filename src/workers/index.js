//Worker que se encarga de mover los mensajes de la cola a la bd de Mongo
const queue = require('../lib/queue');
const mongoDbHelper = require('../lib/mongodb/mongoDbHelpers');
const config = require('../config/config');

//guarda "document" en "collectionName"
const postToDb = (queueName, document) => {
   const names = queueName.split('/');
   const dbName = names[0];
   const collectionName = names[1]; 

    mongoDbHelper.save(dbName, collectionName, document)
        .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}. Res: ${res} `))
        .catch(err => console.log(`Routes@queueToDb error: ${err}`))
}

//los workers comienzan a escuchar a las colas
const start = () => {
    //Defino como se van a manejar los mensajes que estan en la cola "collection1"
    const queueName = 'POST/'+ config.usersDB +'/'+ config.usersCollection;
    queue.receive(queueName, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
        mongoDbHelper.save(dbName, collectionName, document)
        .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}. Res: ${res} `))
        .catch(err => console.log(`Routes@queueToDb error: ${err}`));
    });
    // WORKER para DELETE
    const queueName = 'DELETE/'+ config.usersDB +'/'+ config.usersCollection;
    queue.receive(queueName, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
        mongoDbHelper.save(dbName, collectionName, document)
        .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}. Res: ${res} `))
        .catch(err => console.log(`Routes@queueToDb error: ${err}`));
    });

}

module.exports = { start };