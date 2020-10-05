//Script que se encarga de encolar y desencolar las colas
const amqp = require('amqplib');
var queueUrl = null;
var queueKey = null;
var connection = null;
var channel = null;
var offlineQueue = [];

// Mato todas las conexiones y canales
const killConnections = () => {
    if (connection) connection.close();
    if (channel) channel.close();
    connection = null;
    channel = null;
}

// if the connection is closed or fails to be established at all, we will reconnect :: 
//https://www.cloudamqp.com/docs/nodejs.html
const connect = () => {
    return new Promise((resolve, reject) =>
        amqp.connect(queueUrl)
        .then(conn => {
            console.log("Queue@getConnection: Conexión creada con la cola : %s", queueUrl);
            connection = conn;
            resolve(conn);
        })
        .catch(err => {
            //TODO: Volver a intentar conectarse...
            // console.error("[AMQP]", err.message);
            // return setTimeout(start, 1000);
            console.error("Queue@getConnection: ", err.message);
            reject(err);
        }));
}

//TODO: COMO HAGO PARA MATAR LA CONEXION CUANDO VUELVO A BUILDEAR
//TODO: REVISAR SI LA CONEXION SE CAE O ALGO POR EL ESTILO...
const getConnection = () => {
    return new Promise((resolve, reject) => {
        //TODO: VER QUE ESTA CONEXIÓN ESTE "VIVA"
        if (connection) {
            resolve(connection);
        } else {
            connect(queueUrl, queueKey)
                .then(conn => resolve(conn))
                .catch(err => reject(err));
        }
    });
}

//TODO: REVISAR SI EL CANAL SE CAE O ALGO POR EL ESTILO...
const getChannel = () => {
    return new Promise((resolve, reject) => {
        //TODO: REVISAR QUE ESTE CHANNEL ESTE ANDANDO
        if (channel) resolve(channel);
        else {
            getConnection()
                .then(conn => conn.createChannel())
                .then(cha => {
                    channel = cha;
                    resolve(channel);
                })
                .catch(err => reject(err));
        }
    });
}

// Reinicio la "connection" y el "channel"
const resetConnection = (url, key) => {
    return new Promise((resolve, reject) => {
        try {
            killConnections(); //A: Si ya tengo una conexión la mato (quiero tener una sola)
            queueUrl = url;
            queueKey = key;
            getConnection()
                .then(conn => getChannel())
                .then(cha => resolve(cha))
                .catch(err => reject(err));
        } catch (err) {
            reject(err);
        }
    });
}

//----------------------------- Funciones Públicas ---------------------------------------------

//Función para mandar a encolar un mensaje
const push = (queue, message) => {
    return new Promise((resolve, reject) => {
        console.log('Queue@send: Enquieing message in queue "%s". Message: %s ', queue, message);

        getChannel()
            .then(channel => {
                channel.assertQueue(queue, { durable: false });
                console.log('Queue@send: Queue asserted: queue "%s".', queue);
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
                console.log('Queue@send: Message enqued in "%s". Message: %s ', queue, message);
                resolve();
            })
            .catch(err => reject(err));
    });
};

//Función para suscribirse (desencolar) a una cola ("para los consumers")
const consume = (queue, handler) => {
    return new Promise((resolve, reject) => {
        console.log('Queue@consume: Suscribing to queue "%s".', queue);
        getChannel().then(cha => {
            cha.assertQueue(queue, { durable: false });
            console.log('Queue@consume: Queue asserted: queue "%s".', queue);
            cha.consume(queue,
                msg => handler(JSON.parse(msg.content.toString())), { noAck: true, });
            console.log('Queue@consume: Listening for messages on queue "%s"', queue);
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
};

//Inicializo la cola
const setup = (app, adn) => {
    return new Promise((resolve, reject) => {
        try {
            //TODO: validar URL y Key
            if (adn.queues.rabbitmq) {
                console.log('Queue@setup: url %s!', adn.queues.rabbitmq.url);
                resetConnection(adn.queues.rabbitmq.url, adn.queues.rabbitmq.key)
                    .then(res => resolve(adn))
                    .catch(err => reject(err));
            } else {
                console.log('Queue@setup: rabbitmq no encontrado en el ADN!');
                resolve(adn);
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { push, consume, setup };