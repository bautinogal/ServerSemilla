const gcm = require('node-gcm');

const sendPushNotificationToDevice = (apiKey, regTokenDevice, msg, msgBody) => {
    // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
    var sender = new gcm.Sender(apiKey);

    // Prepare a message to be sent
    var message = new gcm.Message(msg);

    //Adds notification's body to message
    message.addNotification(msgBody);
    
    // Specify which registration IDs to deliver the message to
    var regTokens = regTokenDevice;

    // Actually send the message
    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
        if (err) console.error(err);
        else console.log(response);
});
}

module.exports = { sendPushNotificationToDevice }