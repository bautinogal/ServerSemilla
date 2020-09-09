const { save, get, getCount, deleteOne, deleteMany } = require('./mongoDbHelpers');

// TODO: Verifico que el msg tenga el formato correcto
const validateMsg = (msg) => {

}

// Interfaz con la bd de MongoDb
module.exports = (msg) => {
    if (validateMsg(msg))
        switch (msg.method) {
            case 'POST':
                save(msg.db, msg.collection, msg.content)
                    .then(res => {
                        if (msg.cb) msg.cb(res)
                    })
                    .catch(err => console.log(err));
                break;
            case 'GET':
                get(msg.db, msg.collection, msg.query, msg.queryOptions)
                    .then(res => {
                        if (msg.cb) msg.cb(res)
                    })
                    .catch(err => console.log(err));
                break;
            case 'DELETE_ONE':
                deleteOne(msg.db, msg.collection, msg.query, msg.queryOptions)
                    .then(res => {
                        if (msg.cb) msg.cb(res)
                    })
                    .catch(err => console.log(err));
                break;
            case 'DELETE_MANY' || 'DELETE':
                deleteMany(msg.db, msg.collection, msg.query, msg.queryOptions)
                    .then(res => {
                        if (msg.cb) msg.cb(res)
                    })
                    .catch(err => console.log(err));
                break;
            case 'COUNT':
                getCount(msg.db, msg.collection, msg.query, msg.queryOptions)
                    .then(res => {
                        if (msg.cb) msg.cb(res)
                    })
                    .catch(err => console.log(err));
                break;
            default:
                console.error("Invalid method for mongodb: %s", msg.method);
                break;
        }
}