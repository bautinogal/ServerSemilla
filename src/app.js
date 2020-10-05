// Framework de Node para crear servidores
const express = require('express');
// Herramientas para manipular el "ADN" de la app
const ADNTools = require('./seedLib/ADNTools');
// Script que administra las colas
const queues = require('./seedLib/queues');
// Script que administra los "Endpoints" y sus middlewares
const endpoints = require('./seedLib/endpoints');
// Script que arranca los "workers" que mueven los mensajes de la cola a la bd
const workers = require('./seedLib/workers');
// Script que administra las bds y colas del sistema
const bds = require('./seedLib/bds');

//TODO: agregar certificados ssl y caa
// El servidor comienza a escuchar los requests
const startListening = () => {
    new Promise((resolve, reject) => {
        try {
            const port = app.get('port');
            app.listen(port, () => {
                console.log(`App: Servidor escuchando en el puerto:  ${app.get('port')}`);
                resolve(port);
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Inicializo el servidor
console.log(`App: Inicializando Servidor...`);
const app = express();

ADNTools.getADN({ updateADN: false })
    //  Inicializo la semilla, descargo files adicionales, copio los files publicos del ADN al seed...
    .then(adn => ADNTools.initADN(adn, { deleteExistingContent: true }))
    // Incializo las colas (RabbitMQ)
    .then(adn => queues.setup(app, adn))
    // Seteo los endpoints y el middleware correspondiente
    .then(adn => endpoints.setup(app, adn))
    // Configuro BDs y creao el usuario root de la app, para asegurarme que siempre haya al menos un usuario 
    .then(adn => bds.setup(adn))
    // Prendo workers que van a mover los mensajes de las colas a la bd
    .then(adn => workers.setup(adn))
    //Función del ADN que se llama al final del setup
    .then(adn => ADNTools.readyADN(adn, {}))
    //El servidor comienza a escuchar
    .then(adn => startListening(adn))
    .catch(err => console.log(err));