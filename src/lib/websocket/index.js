const WebSocket = require('ws');

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