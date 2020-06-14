//Script que se encarga de encolar y desencolar las colas
const amqp = require('amqplib');
const queueUrl = process.env.AMQP_URI || 'amqp://localhost';

//Funcion para establecer un canal con la cola
const channel = () => {
    console.log('Queue@channel: Creating channel with: %s.', queueUrl);
    return amqp.connect(queueUrl)
        .then(connection => {
            console.log("Queue@channel: Canal creado con la cola : %s", queueUrl);
            return connection.createChannel();
        })
        .catch(e => {
            console.error("Queue@channel: Error al intentar crear un canal con la cola : %s", queueUrl);
            console.error(e);
        });
};

//Funcion para mandar a encolar un mensaje
const send = (queue, message) => {
    console.log('Queue@send: Message received in queue "%s". Message: %s ', queue, message);

    channel().then(channel => {
        channel.assertQueue(queue, { durable: false });
        message.serverEnqueuedTS = Date.now();
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Queue@send: Message enqued in "%s". Message: %s ', queue, message);
    })
};

//Funcion para suscribirse (desencolar) a una cola ("para los consumers")
const receive = (queue, handler) => {
    console.log('Queue@receive: Suscribing to queue "%s".', queue);
    channel().then(channel => {
        channel.assertQueue(queue, { durable: false });
        console.log('Queue@receive: Listening for messages on queue "%s"', queue);
        channel.consume(queue, msg => handler(JSON.parse(msg.content.toString())), {
            noAck: true,
        });
    });
}

module.exports = { send, receive };