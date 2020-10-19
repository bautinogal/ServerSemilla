const WebSocket = require('ws');
const url = require('url');

//------------------------------ Funciones Publicas -------------------------

const setup = (app, adn) => {

    var data = {
        servers: {
            server1: {
                paths: {
                    "/INTIWS": {
                        onConnection: (ws) => {
                            console.log("Connection succesful!");
                            ws.on("message", (message) => {
                                console.log('ws received: %s', message);
                            });

                            ws.on("close", ()=>{
                                console.log("Connection closed! :(");
                            });

                            ws.send("Probando envío de datos por WebSocket Protocol.");
                        }
                    }
                },
                port: 8281
            }
        }
    }

    try {
        Object.keys(data.servers).forEach(key => {
            var serverData = data.servers[key];
            var paths = {};
            Object.keys(serverData.paths).forEach(pathname => {

                const wss = new WebSocket.Server({ noServer:true });

                wss.on('connection', serverData.paths[pathname].onConnection);
                console.log(serverData.paths[pathname]);
            });

            server.on('upgrade', (request, socket, head) => {
                const pathname = url.parse(request.url).pathname;

                if (paths[pathname] != null) {
                    wss.handleUpgrade(request, socket, head, (ws) => {
                        console.log("Upgraded!");
                        wss.emit('connection', ws, request);
                    });
                } else {
                    socket.destroy();
                }
            });
        });
    } catch (error) {
        console.log("Error creando websocket: " + error);
    }
    return adn;
}

module.exports = { setup }