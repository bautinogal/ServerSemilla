const WebSocket = require('ws');

//------------------------------ Funciones Publicas -------------------------

var wss = null;

const setup = (data) => {
    //data contiene la información para la conexion WebSocket
    wss = new WebSocket.Server({ 'port': data.port, 'path': data.path });

    wss.on('connection', data.onConnection);
}

module.exports = { setup }