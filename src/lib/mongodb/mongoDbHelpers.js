var MongoPool = require('./mongoDbConfig');

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

function get(database, collection, query, queryOptions) {
    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);
    console.log(`mongoDbHelper@get db:${database} coll:${collection} query:${query} queryOptions:${queryOptions}`);
    return MongoPool.getDb(database)
        .then((instance) => instance.collection(collection).find(query, queryOptions).toArray())
        .catch((err) => console.log(err));;
}

function getCount(database, collection, query, queryOptions) {

    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);

    return MongoPool.getDb(database)
        .then((instance) => instance.collection(collection).count(query, queryOptions));


}

module.exports = { save, get, getCount };