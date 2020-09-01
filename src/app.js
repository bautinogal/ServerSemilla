const config = require('./config/envVars') // Archivo de configuracion con variables de entorno y globales
const path = require('path'); // Herramienta para armar los paths independientemente del S.O.
const express = require('express'); // Framework de Node para armar servidores
const bodyParser = require('body-parser'); // Herramienta para parsear el "cuerpo" de los requests
const morgan = require('morgan'); // Herramienta para loggear
const routes = require('./routes/index'); // Script que administra los "Endpoints"
const workers = require('./workers/index'); // Script que arranca los "workers" que mueven los mensajes de la cola a la bd
const repo = require('./lib/repo');
const seed = require('./seed/seed'); // El seed con todas las regrlas de negocios
const favicon = require('serve-favicon');

// Inicializo el servidor
const app = express();
console.log(`App: Inicializando Servidor...`);

// Configuración del servidor
console.log(`App: Configurando el Servidor:`);
app.set('port', config.port || 3000);
console.log(`App: Puerto del servidor seteado en: ${app.get('port')}`);

app.use('/public', express.static(path.join(__dirname, 'public')));

console.log(`App: Servidor Configurado.`);


// Adición de Middlewares al servidor
console.log(`App: Agregando Middleware al Servidor:`);
// Agrego "Morgan" para loggear los requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// parse application/json
app.use(bodyParser.json());
console.log(`App: Middleware agregado.`);
// TODO: SEGURIDAD, VALIDACIONES, ETC...

// Carga de "endpoints"
console.log(`App: Cargando rutas al Servidor:`);

//Middleware:
//TODO: ver q es el favicon y si es necesario esto
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // Esto lo hago para devolver el favicon.ico
app.use((req, res, next) => {
    req.getUrl = () => {
        const url = req.protocol + "://" + req.get('host') + req.originalUrl;
        console.log("app.getUrl: %s", url);
        return url;
    };
    return next();
});

//TODO: ver si debería usar un "view engine" o como me conviene servir las páginas...

app.all('/*', function(req, res) {
    var params = req.params[0].split('/');
    var endpoint = seed.endpoints;

    for (let index = 0; index < params.length; index++) {
        const key = params[index];
        if (key in endpoint)
            endpoint = endpoint[key];
        else
            break;
    }

    if (typeof(endpoint) == 'function')
        endpoint(req, res);
    else
        res.send("Endpoint inválido!");
});

// Prendo workers que van a mover los mensajes de las colas a la bd
workers.start();

// Crear usuario root de la app, para asegurarme que siempre haya al menos un usuario 
repo.createRootUser();


//TODO: agregar certificados ssl y caa
// El servidor comienza a escuchar los requests
console.log(`App: Servidor Listo!`);
app.listen(app.get('port'), () => {
    console.log(`App: Servidor escuchando en el puerto:  ${app.get('port')}`);
});

console.log("Hola Mundo");