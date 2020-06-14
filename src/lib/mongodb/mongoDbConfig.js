var MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = "ExampleDataBase";

function MongoPool() {}
var p_db;

function initPool(cb) {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true, });
        client.connect(function(err) {
            if (err) { reject("Error conectado a mongodb: ", err) }
            const db = client.db(dbName);
            p_db = db;
            resolve(p_db)
        })
    })
}

MongoPool.initPool = initPool;

function getInstance(cb) {
    if (!p_db) {
        return initPool()
    } else {
        return p_db;
    }
}
MongoPool.getInstance = getInstance;

module.exports = MongoPool;