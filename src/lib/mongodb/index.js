const MongoClient = require('mongodb').MongoClient;

var url = null;
var client = null;
var dbs = {};

const getClient = () => {
    return new Promise((resolve, reject) => {
        if (client) resolve(client);
        else {
            client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
            client.connect(function(err) {
                if (err) {
                    console.log(url);
                    client = null;
                    reject("Error conectando a mongodb: %s" + String.toString(err));
                } else {
                    resolve(client);
                }
            });
        }
    });
};

const initPool = (dbName) => {
    return new Promise((resolve, reject) => {
        getClient()
            .then((cli) => {
                const db = cli.db(dbName);
                dbs[dbName] = db;
                resolve(db);
            }).catch((err) => {
                reject(err);
            });
    })
};

const getDb = (db) => {
    if (db in dbs) {
        return new Promise((resolve, reject) => { resolve(dbs[db]) });
    } else {
        return initPool(db);
    }
};

//--------------------------------------------------------------------------------------------

//Me aseguro de que el query y el query options sean objetos
function formatQuery(query) {
    try {
        query = query || {};
        if (typeof query === 'string') query = JSON.parse(query);
        console.log(query);
        return query;
    } catch (error) {
        console.log(error);
        return {};
    }
};

//TODO: reemplazar get y gecount por este metodo generico
function aggregate(database, collection, pipeline, options) {
    console.log(`mongo@aggregate: db: ${database} col: ${collection} pipeline: ${pipeline} options:${options}`);
    // pipeline = formatQuery(pipeline);
    //options = formatQuery(options);
    return new Promise((resolve, reject) => {
        getDb(database)
            .then((db) => {
                return db.collection(collection);
            })
            .then((col) => {
                return col.aggregate(JSON.parse(pipeline), JSON.parse(options)).toArray();
            })
            .then((res) => {
                console.log(`mongo@aggregate: result: ${res}`);
                resolve(res);
            })
            .catch((err) => {
                console.log(`mongo@aggregate: error:${err}`);
                reject(err);
            });
    })
}

//U: guardar un documento en la colleccion 
function post(database, collection, document) {
    console.log(`mongo@post: db: ${database} col: ${collection} doc: ${document}`);
    return new Promise((resolve, reject) => {
        getDb(database)
            .then((instance) => instance.collection(collection))
            .then((col) => {
                if (typeof(document) === "object") {
                    return col.insertOne(document);
                } else if (typeof(document) === "array") {
                    return col.insertMany(document);
                } else {
                    if (document) throw "mongoDbHelpers: error in document type: " + document.toString();
                    else throw "mongoDbHelpers: error: document is null!";
                }
            })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
};

// Funcion que me devuelve un array de todos los elementos de la collecion que coinciden con el query
function get(database, collection, query, queryOptions) {
    console.log(`mongo@get: db: ${database} col: ${collection} q: ${query} qo:${queryOptions}`);
    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);
    return new Promise((resolve, reject) => {
        getDb(database)
            .then((db) => {
                return db.collection(collection);
            })
            .then((col) => {
                return col.find(query, queryOptions);
            })
            .then((res) => {
                return res.toArray();
            })
            .then((res) => {
                console.log(`mongo@get: result: ${res}`);
                resolve(res);
            })
            .catch((err) => {
                console.log(`mongo@get: error:${err}`);
                reject(err);
            });
    })
};

// Funcion que me devuelve la cantidad de elementos de la collecion que coinciden con el query
function getCount(database, collection, query, queryOptions) {
    console.log(`mongo@getCount: db: ${database} col: ${collection} q: ${query} qo:${queryOptions}`);
    query = formatQuery(query);
    queryOptions = formatQuery(queryOptions);

    return new Promise((resolve, reject) => {
        getDb(database)
            .then((db) => {
                return db.collection(collection);
            })
            .then((col) => {
                return col.count(query, queryOptions);
            })
            .then((res) => {
                console.log(`mongo@getCount: result: ${res}`);
                resolve(res);
            })
            .catch((err) => {
                console.log(`mongo@getCount: error:${err}`);
                reject(err);
            });
    })
};

// Funcion que usamos para borrar un elemento de una bs/collection
function deleteOne(database, collection, query, queryOptions) {
    console.log(`mongo@deleteOne: db: ${database} col: ${collection} q: ${query} qo:${queryOptions}`);
    return new Promise((resolve, reject) => {
        query = formatQuery(query);
        queryOptions = formatQuery(queryOptions);

        getDb(database)
            .then((db) => db.collection(collection).deleteOne(query, queryOptions))
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });

};

// Funcion que usamos para borrar todos los elementos de una bs/collection
function deleteMany(database, collection, query, queryOptions) {
    console.log(`mongo@deleteMany: db: ${database} col: ${collection} q: ${query} qo:${queryOptions}`);
    return new Promise((resolve, reject) => {
        query = formatQuery(query);
        queryOptions = formatQuery(queryOptions);
        getDb(database)
            .then((db) => db.collection(collection).deleteMany(query, queryOptions))
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};

//-------------------------------------------------------------------------------------------

// TODO: Verifico que el msg tenga el formato correcto
const validateMsg = (msg) => {
    return true;
};

const query = (msg) => {
    console.log("Mongodb query: " + JSON.stringify(msg));
    if (validateMsg(msg))
        switch (msg.method) {
            case 'AGGREGATE':
                return aggregate(msg.db, msg.collection, msg.pipeline, msg.options)
            case 'POST':
                return post(msg.db, msg.collection, msg.content)
            case 'GET':
                return get(msg.db, msg.collection, msg.query, msg.queryOptions)
            case 'DELETE_ONE':
                return deleteOne(msg.db, msg.collection, msg.query, msg.queryOptions)
            case 'DELETE':
                return deleteMany(msg.db, msg.collection, msg.query, msg.queryOptions)
            case 'COUNT':
                return getCount(msg.db, msg.collection, msg.query, msg.queryOptions)
            default:
                reject("Invalid method for mongodb: %s", msg.method);
                return new Promise((res, rej) => { res() });
        }
    else {
        reject("Invalid query format for mongodb: %s", msg);
        return new Promise((res, rej) => { res() });
    }
};

const setup = (data) => {
    return new Promise((resolve, reject) => {
        try {
            if (client) client.close();
            client = null;
            dbs = {};
            url = data.url;
            getDb(data.dfltDb)
                .then(db => resolve())
                .catch(err => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};

// Interfaz con la bd de MongoDb
module.exports = { setup, query }