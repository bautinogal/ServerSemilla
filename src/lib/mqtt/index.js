const { cmd } = require('../../ADN/lib/index');
const mqtt = require('mqtt');

function connectToBroker(url, credentials, topics){
    const mqttClient = mqtt.connect(url, credentials);
    //TODO: Manipulación de los mensajes recibidos según tópico.
    console.log("Starting...");
    mqttClient.on("connect", ()=>{
        console.log("Cliente conectado a BROKER MQTT.");
        mqttClient.subscribe(topics);
    });

    mqttClient.on("message", (topic, message)=>{
        console.log(`Mensaje: ${message} --- Recibido de Topico ${topic}.`);
        switch (topic) {
            case "start":
                sendMessageToDB(topic, message);
                console.log(`Mensaje: ${message} enviado a la base de datos!`);
                break;
            case "quick":
                sendMessageToDB(topic, message);
                console.log(`Mensaje: ${message} enviado a la base de datos!`);
                break;
            case "slow":
                sendMessageToDB(topic, message);
                console.log(`Mensaje: ${message} enviado a la base de datos!`);
                break;
            case "testtopic":
                sendMessageToDB(topic, message);
                console.log(`Mensaje: ${message} enviado a la base de datos!`);
                break;
            default:
                console.log('El mensaje recibido no coincide con los tópicos suscriptos. MSG: ' + message);
                break;
        }
    });
}

const sendMessageToDB = (topic, message) => {
    let mensaje = JSON.parse(message.toString());
    cmd({
        type: "mongo",
        method: "POST",
        db: 'admin', 
        collection: topic,
        content: {
                topic: topic,
                mensaje: mensaje
            }
    })
}

module.exports = {connectToBroker}
