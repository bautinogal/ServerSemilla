var MongoPool = require('./mongoDbConfig');

//Me aseguro de que el query y el query options sean objetos
function formatQuery(query) {
    query = query || {};
    if (typeof query === 'string') query = JSON.parse(query);
    return query;
}

//U: guardar un documento en la colleccion 
function save(database, collection, document) {
    return new Promise((resolve, reject) => {
        MongoPool.getDb(database)
            .then((instance) => instance.collection(collection))
            .then((col) => {
                if (typeof(document) === "object") {
                    return col.insertOne(document);
                } else if (typeof(document) === "array") {
                    return col.insertMany(document);
                } else {
                    throw "mongoDbHelpers: error in document type: " + document.toString();
                }
            })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

// Funcion que me devuelve un array de todos los elementos de la collecion que coinciden con el query
function get(database, collection, query, queryOptions) {
    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);

    return new Promise((resolve, reject) => {
        MongoPool.getDb(database)
            .then((instance) => instance.collection(collection))
            .then((col) => col.find(query, queryOptions))
            .then((count) => resolve(count.toArray()))
            .catch((err) => reject(err));
    })
}

// Funcion que me devuelve la cantidad de elementos de la collecion que coinciden con el query
function getCount(database, collection, query, queryOptions) {

    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);

    return new Promise((resolve, reject) => {
        MongoPool.getDb(database)
            .then((instance) => instance.collection(collection))
            .then((col) => col.count(query, queryOptions))
            .then((count) => resolve(count))
            .catch((err) => reject(err));
    })
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
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });

}

// Funcion que usamos para borrar todos los elementos de una bs/collection
function deleteMany(database, collection, query, queryOptions) {
    return new Promise((resolve, reject) => {
        query = formatQuery(query);
        queryOptions = formatQuery(queryOptions);

        MongoPool.getDb(database)
            .then((instance) => {
                return instance.collection(collection).deleteMany(query, queryOptions);
            })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });

}


module.exports = { save, get, getCount, deleteOne, deleteMany };