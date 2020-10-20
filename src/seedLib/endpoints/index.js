const express = require('express'); // Librería de Node para armar servidores
const path = require('path'); // Librería para unificar los path independiente del OS en el que estamos
const config = require('../../config'); // Script de configuracion general

const cookieParser = require('cookie-parser') // Herramienta para parsear las cookies
const bodyParser = require('body-parser'); // Herramienta para parsear el "cuerpo" de los requests
const morgan = require('morgan'); // Herramienta para loggear
const wsHelper = require('../../lib/websocket/index');
const favicon = require('serve-favicon');
const ADN = require('../../ADN');

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const webSocket = require('../../lib/websocket');

//Seteo el puerto del servidor
const setPort = (app, adn) => {
    app.set('port', config.port || 3000);
    console.log(`endpoints@setup: Puerto del servidor seteado en: ${app.get('port')}`);
};

//Marco la carpeta que voy a compartir con el frontend
const setPublicFolder = (app, adn) => {
    app.use('/public', express.static('public'));
    console.log(`endpoints@setup: Carpeta publica en: /public`);
}

//Agrego todos los middlewares
const setMiddleWare = (app, adn) => {
    //Middlewares:

    //"Morgan" es una herramienta para loggear
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    console.log(`endpoints@setup: 'morgan' middleware aagregado`);
    app.use(cookieParser());
    console.log(`endpoints@setup: 'cookieParser' middleware agregado`);
    //"bodyParser" es un middleware que me ayuda a parsear los requests
    app.use(bodyParser.urlencoded());
    console.log(`endpoints@setup: 'bodyParser.urlencoded' middleware agregado`);
    app.use(bodyParser.json());
    console.log(`endpoints@setup: 'bodyParser.json' middleware agregado`);
    // Esto lo hago para devolver el favicon.ico
    //TODO: ver q es el favicon y si es necesario esto
    app.use(favicon(path.join(__dirname, '../../public/assets/icons', 'favicon.ico')));
    // Agrego una función que me devuelve la URL que me resulta cómoda
    app.use((req, res, next) => {
        req.getUrl = () => {
            const url = req.protocol + "://" + req.get('host') + req.originalUrl;
            console.log("Req URL: %s", url);
            return url;
        };
        req.getUrl();
        return next();
    });
    // TODO: SEGURIDAD, VALIDACIONES, ETC...
    app.use(upload.single('file'));

}

//Creo los endpoints a partid de la info que levanto del "ADN"
const setEndpoints = (app, adn) => {
    // TODO: SEGURIDAD, VALIDACIONES, ETC...
    //Endpoint genérico:
    app.all('/*', function(req, res) {
        var params = req.params[0].split('/');
        var endpoint = adn.endpoints;

        if (params[0] == "public")
            return;

        //Recorro el objeto "endpoint" con los parametros del request
        for (let index = 0; index < params.length; index++) {
            const key = params[index];
            if (key in endpoint) {
                console.log("key: " + key);
                endpoint = endpoint[key];
            } else
                break;
        }

        if (typeof(endpoint) == 'function')
            endpoint(req, res);
        else
            res.send("Endpoint inválido!");
    });
}

const setWebSocketServer = (app, adn) => {

    wsHelper.setup(app, adn.websocket);

}

//Configuro el servidor y endpoints
const setup = (app, adn) => {
    console.log(`endpoints@setup: starting!`);
    //console.table(adn.endpoints);
    return new Promise((resolve, reject) => {
        try {
            setPort(app, adn);
            setPublicFolder(app, adn);
            setMiddleWare(app, adn);
            setEndpoints(app, adn);
            //setWebSocketServer(app, adn); 

            resolve(adn);

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { setup };