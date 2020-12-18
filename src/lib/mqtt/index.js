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
        try {
            console.log(`Mensaje: ${message} --- Recibido de Topico ${topic}.`);
            sendMessageToDB(topic, message);
            console.log(`Mensaje ${message} con tópico ${topic} enviado a la colección -> ${topic}`);
        } catch (error) {
            console.log(`Message error: ${error}`);
        }
    });
}

const sendMessageToDB = (topic, message) => {
    let mensaje = JSON.parse(message.toString());
    let arrayTopic = topic.split("/");
    let lastTopic;
    Array.isArray(arrayTopic) ? lastTopic =arrayTopic[arrayTopic.length - 1] : lastTopic = arrayTopic; 
    console.log(lastTopic);
    cmd({
        type: "mongo",
        method: "POST",
        db: 'admin', 
        collection: lastTopic,
        content: {
                topic: topic,
                mensaje: mensaje
            }
    })
}

module.exports = {connectToBroker}
