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

function get(collectionName, query) {
    return new Promise(async(resolve, reject) => {
        let db = await MongoPool.getInstance()
        db.collection(collectionName).find(query)
            .toArray(async(err, result) => {
                let count = await db.collection(collectionName).countDocuments(query);
                if (err) reject(err)
                resolve({ result, count })
            });
    })
}

module.exports = { save, get };