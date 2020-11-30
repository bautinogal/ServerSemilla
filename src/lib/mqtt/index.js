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
            /*case "start":
                
                break;
            case "quick":

                break;
            case "slow":

                break;*/
            case "testtopic":
                sendMessageToDB(topic, message);
                console.log(`Mensaje: ${message} enviado a la base de datos!`);
                break;
            default:

                break;
        }
        
    });
}

const sendMessageToDB = (topic, message) => {
    let mensaje = message.toString();
    cmd({
        type: "mongo",
        method: "POST",
        db: 'admin', 
        collection: 'Test',
        content: {
                topic: topic,
                mensaje: mensaje
            }
    })
}

module.exports = {connectToBroker}
