//Worker que se encarga de mover los mensajes de la cola a la bd de Mongo
const queue = require('../lib/queue');
const mongoDbHelper = require('../lib/mongodb/mongoDbHelpers');
const config = require('../config/config');


//los workers comienzan a escuchar a las colas
const start = () => {
    //Defino como se van a manejar los mensajes que estan en la cola "collection1"
    const queueName = 'POST/'+ config.usersDB +'/'+ config.usersCollection;
    queue.receive(queueName, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
        mongoDbHelper.save(config.usersDB, config.usersCollection, document)
        .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}. Res: ${res} `))
        .catch(err => console.log(`Routes@queueToDb error: ${err}`));
    });
    // WORKER para DELETE
    const queue2 = 'DELETE/'+ config.usersDB +'/'+ config.usersCollection;
    queue.receive(queue2, (query) => {
        console.log(`Worker@consume: ${JSON.stringify(query)} to ${queue2}`);
        mongoDbHelper.deleteMany(config.usersDB, config.usersCollection, query, queryOptions)
        .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queue2}. Res: ${res} `))
        .catch(err => console.log(`Routes@queueToDb error: ${err}`));
    });

}

module.exports = { start };