//Worker que se encarga de mover los mensajes de la cola a la bd de Mongo
const queue = require('../lib/queue');
const mongoDbHelper = require('../lib/mongodb/mongoDbHelpers');
const config = require('../config/envVars');


//los workers comienzan a escuchar a las colas
const start = () => {
    //Defino como se van a manejar los mensajes que estan en la cola "collection1"
    const queueName = 'POST/' + config.usersDB + '/' + config.usersCollection;
    queue.receive(queueName, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
        mongoDbHelper.save(config.usersDB, config.usersCollection, document)
            .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}`))
            .catch(err => console.log(`Routes@queueToDb error: ${err}`));
    });
    // WORKER para DELETE
    const queueDelete = 'DELETE/' + config.usersDB + '/' + config.usersCollection;
    queue.receive(queueDelete, (query) => {
        console.log(`Worker@consume: ${JSON.stringify(query)} to ${queueDelete}`);
        mongoDbHelper.deleteMany(config.usersDB, config.usersCollection, query, queryOptions)
            .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} deleted from ${queueDelete}`))
            .catch(err => console.log(`Routes@queueToDb error: ${err}`));
    });

    const queueINTI = 'POST/' + config.usersDB + '/INTI';
    queue.receive(queueINTI, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueINTI}`);
        mongoDbHelper.save(config.usersDB, 'INTI', document)
            .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueINTI}`))
            .catch(err => console.log(`Routes@queueToDb error: ${err}`));
    });
// WORKER PARA TEST
    const queueTest = 'POST/test/test';
    queue.receive(queueTest, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueTest}`);
        mongoDbHelper.save('test', 'test', document)
            .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueTest}`))
            .catch(err => console.log(`Routes@queueToDb error: ${err}`));
    });

}

module.exports = { start };