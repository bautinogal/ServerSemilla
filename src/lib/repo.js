//Script que oculta el manejo de las bases de datos...
//TODO: Persistir todo en un base relacional a largo plazo
const {get, getCount } = require('../lib/mongodb/mongoDbHelpers');
const queue = require('../lib/queue');

//TODO: Revisar con alguien que sepa de arquitectura si esta bien agregar el campo reqInfo...
const post = (collection, message, reqInfo) => {
    console.log(`Repo@post/${collection} message: ${JSON.stringify(message)} reqInfo: ${JSON.stringify(reqInfo)})`);
    message.reqInfo = reqInfo;
    queue.send(collection, message);
};

module.exports = { post, get, getCount };