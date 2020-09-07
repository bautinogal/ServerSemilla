//Script que se encarga de encolar y desencolar las colas
const amqp = require('amqplib');
const config = require('../../config');
const queueUrl = config.queueUrl;

//Funcion para establecer un canal con la cola
const channel = () => {
    console.log('Queue@channel: Creando conexión con: %s.', queueUrl);
    return new Promise((resolve, reject) => {
        return amqp.connect(queueUrl)
            .then(connection => {
                console.log("Queue@channel: Conexión creada con la cola : %s", queueUrl);
                return connection.createChannel();
            })
            .then(channel => {
                console.log("Queue@channel: Canal creado con la cola : %s", queueUrl);
                resolve(channel);
            })
            .catch(e => {
                console.error("Queue@channel: Error al intentar crear un canal con la cola : %s", queueUrl);
                reject(e);
            });
    });
};

//Funcion para mandar a encolar un mensaje
const push = (queue, message) => {
    return new Promise((resolve, reject) => {
        console.log('Queue@send: Enquieing message in queue "%s". Message: %s ', queue, message);

        channel()
            .then(channel => {
                await channel.assertQueue(queue, { durable: false });
                console.log('Queue@send: Queue asserted: queue "%s".', queue);
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
                console.log('Queue@send: Message enqued in "%s". Message: %s ', queue, message);
                resolve();
            })
            .catch(err => reject(err));
    });
};

//Funcion para suscribirse (desencolar) a una cola ("para los consumers")
const consume = (queue, handler) => {
    return new Promise((resolve, reject) => {
        console.log('Queue@consume: Suscribing to queue "%s".', queue);
        channel().then(channel => {
            channel.assertQueue(queue, { durable: false });
            console.log('Queue@consume: Queue asserted: queue "%s".', queue);
            channel.consume(queue,
                msg => handler(JSON.parse(msg.content.toString())), { noAck: true, });
            console.log('Queue@consume: Listening for messages on queue "%s"', queue);
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
};

module.exports = { push, consume };