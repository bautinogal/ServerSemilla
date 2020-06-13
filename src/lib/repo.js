const mongoose = require('mongoose');
const Message = require('../schemas/test')

//TODO: Esta bien usar una variable de entorno para esto?
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/notifier';

//TODO: no se que significan esos parametros
//TODO: Esta bien dejar esta conexión siempre abierta? y sí se cae?
console.log(`Repo: Conectando con bd en ${dbUrl}`);
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(data => console.log(`Repo: Conectado con exito a la bd "${dbUrl}"`))
    .catch(e => console.error(`Repo: Error al intentar conectarse con la bd "${dbUrl}". Error: ${e}`));

//TODO: manejar bien la desconexión
mongoose.connection.on('error', console.error);

// Función para guardar mensajes en la bd con el "Schema" anterior
const create = attrs => {
    console.log("Repo@Create: creating with attributes: %s", attrs);
    return new Message(attrs).save();
}

//TODO: Por alguna razón "messages" vuelve vacio
const list = () => Message
    .find()
    .then(messages => messages.slice().reverse())
    .catch(e => {
        console.log("Error con Messages");
        console.error(e);
    });

module.exports = { create, list };