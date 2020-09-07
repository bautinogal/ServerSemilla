// Framework de Node para crear servidores
const express = require('express');
// Herramientas para manipular el "ADN" de la app
const ADNTools = require('./seed/ADNTools');
<<<<<<< HEAD
// Script que administra las colas
const queues = require('./seed/queues');
// Script que administra los "Endpoints" y sus middlewares
const endpoints = require('./seed/endpoints');
// Script que arranca los "workers" que mueven los mensajes de la cola a la bd
const workers = require('./seed/workers');
// Script que administra las bds y colas del sistema
const repo = require('./seed/repo');
=======
// Script que administra los "Endpoints" y sus middlewares
const endpoints = require('./seed/endpoints');
// // Script que arranca los "workers" que mueven los mensajes de la cola a la bd
// const workers = require('./seed/workers');
// // Script que administra las bds y colas del sistema
// const repo = require('./seed/repo');
>>>>>>> e2e721b34999b25c9a5b52c9935c26f579470d5d

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
    // Inicializo la semilla (agrego public files, etc...)
<<<<<<< HEAD
    .then(adn => adn.setup(app))
    // Incializo las colas (RabbitMQ)
    .then(adn => queues.setup(app, adn))
    // Seteo los endpoints y el middleware correspondiente
    .then(adn => endpoints.setup(app, adn))
    // Configuro BDs y creao el usuario root de la app, para asegurarme que siempre haya al menos un usuario 
    .then(adn => repo.setup(adn))
    // Prendo workers que van a mover los mensajes de las colas a la bd
    .then(adn => workers.setup(adn))
    //El servidor comienza a escuchar
    .then(adn => startListening(adn))
    .catch(err => console.log(err));
=======
    .then(adn => adn.setup())
    // Seteo los endpoints y el middleware correspondiente
    .then(adn => { endpoints.setup(app, adn); return adn })
    // // Prendo workers que van a mover los mensajes de las colas a la bd
    // .then(adn => { workers.setup(adn); return adn })
    // // Configuro BDs y creao el usuario root de la app, para asegurarme que siempre haya al menos un usuario 
    // .then(adn => { repo.setup(adn); return adn })
    // El servidor comienza a escuchar
    .then(adn => startListening(adn))
    .catch(err => console.log(err));
>>>>>>> e2e721b34999b25c9a5b52c9935c26f579470d5d
