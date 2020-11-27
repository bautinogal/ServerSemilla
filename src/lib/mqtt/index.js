const mqtt = require('mqtt');
//TODO: Mover los datos Hardcodeados a variables de entorno o ADN.
const mqttClient = mqtt.connect("ws://52.90.77.249:8083/mqtt", {username: "admin", password: "public"});
const topics= ['inti/865067021324796/start', 'inti/865067021324796/quick', 'inti/865067021324796/slow', 'testtopic'];

//TODO: Manipulación de los mensajes recibidos según tópico.
function subscribeToTopics(topics) {
    console.log("Starting...");
    mqttClient.on("connect", ()=>{
        console.log("Cliente conectado a BROKER MQTT.");
        mqttClient.subscribe(topics);
    });

    mqttClient.on("message", (topic, message)=>{
        console.log(`Mensaje: ${message} --- Recibido de Topico ${topic}.`);
    });
}

module.exports = {subscribeToTopics}
