//Worker que se encarga de mover los mensajes de la cola a la bd de Mongo
const queue = require('../lib/queue');
const mongoDbHelper = require('../lib/mongodb/mongoDbHelpers');

//guarda "document" en "collectionName"
const queueToDb = (collectionName, document) => {
    mongoDbHelper.save(collectionName, document)
        .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${collectionName}. Res: ${res} `))
        .catch(err => console.log(`Routes@queueToDb error: ${err}`))
}

//los workers comienzan a escuchar a las colas
const start = () => {
    //Defino como se van a manejar los mensajes que estan en la cola "collection1"
    var collection = "collection1";
    queue.receive(collection, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${collection}`);
        queueToDb(collection, document);
    });

    //Defino como se van a manejar los mensajes que estan en la cola "collection2"
    collection = "collection2";
    queue.receive(collection, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${collection}`);
        queueToDb(collection, document);
    });

    //Defino como se van a manejar los mensajes que estan en la cola "collection3"
    collection = "collection3";
    queue.receive(collection, (document) => {
        console.log(`Worker@consume: ${JSON.stringify(document)} to ${collection}`);
        queueToDb(collection, document);
    });
}

module.exports = { start };