var MongoPool = require('./mongoDbConfig');

function formatQuery(query) {
    query = query || {};
    if (typeof query === 'string') query = JSON.parse(query);
    return query;
}

async function save(collectionName, document) { //U: guardar un documento en la colleccion pasada, devuelve una promesa
    let db = await MongoPool.getInstance(); //A: obtengo una coneccion existente o creo una nueva con la db
    if (typeof(document) === "object") {
        return db.collection(collectionName).insertOne(document)
    } else if (typeof(document) === "array") {
        return db.collection(collectionName).insertMany(document)
    } else {
        console.log("mongoDbHelpers: error in document type: %s", document);
    }
}

function get(collectionName, query, queryOptions) {

    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);
    console.log(query);
    console.log(queryOptions);
    return MongoPool.getInstance().then((instance) => instance.collection(collectionName).find(query, queryOptions).toArray());
}

function getCount(collectionName, query, queryOptions) {

    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);

    return MongoPool.getInstance().then((instance) => instance.collection(collectionName).count(query, queryOptions));

}

module.exports = { save, get, getCount };