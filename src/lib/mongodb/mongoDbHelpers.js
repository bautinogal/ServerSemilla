var MongoPool = require('./mongoDbConfig');
const { delete } = require('request');

function formatQuery(query) {
    query = query || {};
    if (typeof query === 'string') query = JSON.parse(query);
    return query;
}

async function save(database, collection, document) { //U: guardar un documento en la colleccion pasada, devuelve una promesa
    let db = await MongoPool.getDb(database); //A: obtengo una coneccion existente o creo una nueva con la db
    if (typeof(document) === "object") {
        return db.collection(collection).insertOne(document)
    } else if (typeof(document) === "array") {
        return db.collection(collection).insertMany(document)
    } else {
        console.log("mongoDbHelpers: error in document type: %s", document);
    }
}

//TODO: REVISAR SI ESTAS FUNCIONES NO TIENEN Q SER ASYNC
function get(database, collection, query, queryOptions) {
    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);
    console.log(`mongoDbHelper@get db:${database} coll:${collection} query:${query} queryOptions:${queryOptions}`);
    return MongoPool.getDb(database)
        .then((instance) => instance.collection(collection).find(query, queryOptions).toArray())
        .catch((err) => console.log(err));
}

function getCount(database, collection, query, queryOptions) {

    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);

    return MongoPool.getDb(database)
        .then((instance) => instance.collection(collection).count(query, queryOptions))
        .catch((err) => console.log(err));
}

// Funcion que usamos para borrar un elemento de una bs/collection
function deleteOne(database, collection, query, queryOptions) {
    return new Promise((resolve, reject) => {
        query = formatQuery(query);
        queryOptions = formatQuery(queryOptions);

        MongoPool.getDb(database)
            .then((instance) => {
                return instance.collection(collection).deleteOne(query, queryOptions);
            })
            .then((res) => {
                console.log(`mongoDbHelper@deleteOne db:${database} coll:${collection} query:${query} queryOptions:${queryOptions} Succesfull!`);
                resolve(res);
            })
            .catch((err) => {
                console.log(`mongoDbHelper@deleteOne error:${err}`);
                reject(err);
            });
    });

}

async function deleteMany(database, collection, query) {

    query = formatQuery(query);

    let db = await MongoPool.getDb(database)
        .then((instance) => {
            instance.collection(collection).deleteMany(query);
            console.log('Query: ' + query + ' deleted');
        })
        .catch((err) => {
            console.log(err);
        });
}


module.exports = { save, get, getCount, deleteDocuments };