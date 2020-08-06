var request = require('request');

var element = {};
element.num = 0;

var body = {
    url: "http://localhost:3000/api/post/collection1",
    method: "POST",
    json: true, // <--Very important!!!
    body: element
}

const post = () => {
    request(body, function(error, response, body) {
        console.log(body);
    });
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function myStopFunction() {
    clearInterval(func);
}

var time = 110;
var func = setInterval(function() {
    element.fecha = randomDate(new Date(2012, 0, 1), new Date()).toString();
    element.interno = Math.trunc(Math.random() * 2000).toString();
    element.codigo = Math.trunc(Math.random() * 200).toString();
    element.descripcion = "Esto es una descripcion de ejemplo max 90 alcanzada 120";
    element.patente = Math.random().toString(36).substring(7);
    post();
    if (time < 0) {
        myStopFunction();
    }
    time--;
}, 10);