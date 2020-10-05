const WebSocket = require('ws');

<<<<<<< HEAD
//------------------------------ Funciones Publicas -------------------------

const create = (app, data) => {
    data = {
        path: "ws://www.host.com/path",
        onOpen: () => {
            ws.send('something');
        },
        onMessage: (data) => {
            console.log(data);
        },
    }
    const ws = new WebSocket(data.path);
    ws.on('open', data.onOpen);
    ws.on('message', data.onMessage);
}

module.exports = { create };
=======
var wss = null;

const setup = (data) => {    
    //data contiene la información para la conexion WebSocket
    wss = new WebSocket.Server({'port': data.port, 'path': data.path});

    wss.on('connection', data.onConnection);
}

module.exports = { setup }
>>>>>>> b2025cca84418284ccf7591b22ba96e5066739ad
