const path = require('path'); // Herramienta para armar los paths independientemente del S.O.
const express = require('express'); // Framework de Node para armar servidores
const morgan = require('morgan'); // Herramienta para loggear
const routes = require('./routes/index'); // Script que administra los "Endpoints"

// Inicializo el servidor
const app = express();
console.log(`App: Inicializando Servidor...`);

// Configuración del servidor
console.log(`App: Configurando el Servidor:`);
app.set('port', process.env.PORT || 3000);
console.log(`App: Puerto del servidor seteado en: ${app.get('port')}`);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
console.log(`App: Usando "ejs" como "View Engine"`);
console.log(`App: Servidor Configurado.`);

// Adición de Middlewares al servidor
console.log(`App: Agregando Middleware al Servidor:`);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // Loggea los requests
app.use(express.urlencoded({ extended: false })) // Herramienta para parsear los JSONs que llegan en los requests
console.log(`App: Middleware agregado.`);
// TODO: SEGURIDAD, VALIDACIONES, ETC...

// Carga de endpoints
console.log(`App: Cargando rutas al Servidor:`);
app.use('/', routes);
console.log(`App: Rutas cargadas:`);

// Prendo worker que va a mover los mensajes de la cola a la bd
const worker = require('./workers/wRabToMdb');

// Puesta en marcha del servidor
console.log(`App: Servidor Listo!`);
app.listen(app.get('port'), () => {
    console.log(`App: Servidor escuchando en el puerto:  ${app.get('port')}`);
});