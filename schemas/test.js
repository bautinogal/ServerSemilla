const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//TODO: Tengo que usar si o si un SCHEMA con mongoose??
const messageSchema = new mongoose.Schema({
    Fecha: String,
    Mensaje: String,
    Codigo: String,
    Latitud: Number,
    Longitud: Number,
    Interno: String,
    Patente: String,
    protocol: String,
    url: String,
    serverReceived: Number,
    serverEnqueued: Number
});

// Agrego el "Schema" a los modelos de Mongoose
module.exports = mongoose.model('Message', messageSchema);