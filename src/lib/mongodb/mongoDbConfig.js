//TODO: Revisar todo este script y comentar!!
const config = require('../../config/envVars');
const MongoClient = require('mongodb').MongoClient;

const url = config.mongoUri || 'mongodb://localhost:27017';

var client;
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
}

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
}

const getDb = (db) => {
    if (db in dbs) {
        return new Promise((resolve, reject) => { resolve(dbs[db]) });
    } else {
        return initPool(db);
    }
}

module.exports = { getDb };