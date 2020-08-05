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


for (let index = 0; index < 12; index++) {
    setTimeout(post, 1000);
    element.num = element.num + 1;
}