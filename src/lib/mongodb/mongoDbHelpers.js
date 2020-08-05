var MongoPool = require('./mongoDbConfig');

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

    //Si me vienen vacios los parametres les asigno un objeto vacio
    if (query == null)
        query = {};

    if (queryOptions == null)
        queryOptions = {};

    //Si me vienen strings los convierto a objetos que es lo que quiere mongo
    if (typeof query === 'string')
        query = JSON.parse(query);
    if (typeof queryOptions === 'string')
        queryOptions = JSON.parse(queryOptions);


    return MongoPool.getInstance()
        .then(db => db.collection(collectionName).find(query, queryOptions).toArray())
        .catch(err => console.log("get error: %s", err));

    return new Promise(async(resolve, reject) => {
        let db = await MongoPool.getInstance();
        db.collection(collectionName).find(query, queryOptions)
            .then(res => res)
            .toArray(async(err, result) => {
                if (err)
                    reject(err);
                resolve(result.toString());
            });
    })
}

function getCount(collectionName, query, queryOptions) {

    //Si me vienen vacios le agrego un objeto vacio si son strings los parseo
    if (query == null)
        query = {};
    else if (typeof query === 'string')
        query = JSON.parse(query);

    if (queryOptions == null)
        queryOptions = {};
    else if (typeof queryOptions === 'string')
        queryOptions = JSON.parse(queryOptions);


    return MongoPool.getInstance().collection(collectionName).count(query, queryOptions);


}

module.exports = { save, get, getCount };