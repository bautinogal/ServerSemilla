const http = require('http');
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
                            ws.on('message', function incoming(message) {
                                console.log('ws received: %s', message);
                            });

                            ws.send('something');
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
            var server = http.createServer();

            var paths = {};
            Object.keys(serverData.paths).forEach(pathname => {
                const wss = new WebSocket.Server({ noServer: true });
                wss.on('connection', serverData.paths[pathname].onConnection);
                paths[pathname] = (request, socket, head) => {
                    wss.handleUpgrade(request, socket, head, (ws) => {
                        wss.emit('connection', ws, request);
                    });
                }
            });

            server.on('upgrade', (request, socket, head) => {
                const pathname = url.parse(request.url).pathname;

                if (paths[pathname] != null) {
                    paths[pathname](request, socket, head);
                } else {
                    socket.destroy();
                }
            });

            server.listen(serverData.port);
        });
    } catch (error) {
        console.log("Error creando websocket: " + error);
    }
    return adn;
}

module.exports = { setup }