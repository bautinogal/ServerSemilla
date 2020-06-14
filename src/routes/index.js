const express = require('express');
const router = express.Router();
const Task = require('../schemas/test');
const queue = require('../lib/queue');
const bodyParser = require('body-parser');
const {list}= require('../lib/mongodb/mongoDbHelpers');
const config= require('../config/config');

//función que valida si el que hace el request puede acceder al path
//TODO: esta bien implementar esto aca?
//TODO: implementarla
function validate(req, authorizeds) {
    return true;
}

//Endpoints de la pagina:
//SIN RUTA
router.get('/', async(req, res) => {
    console.log("Routes: /");
    res.redirect('/login'); //Si no pongo ninguna ruta me reenvía al login:
    res.send('hello world');
});

//LOGIN
router.get('/login', async(req, res) => {
    let authorizeds = {
        rols: ['admin', 'empleado', 'cliente']
    }
    if (validate(req, authorizeds))
        res.redirect('/dashboard'); //Si ya estoy logeado me manda al dashboard
    else {
        const tasks = await Task.find();
        res.render('index', {
            tasks
        });
    }
});

//DASHBOARD
router.get('/dashboard', async(req, res) => {
    let authorizeds = {
        rols: ['admin', 'empleado', 'cliente']
    }
    if (validate(req, authorizeds)) {
        console.log("DASHBOARD");
        const tasks = await Task.find();
        console.log(`TASKS: ${tasks}`);
        res.render('index', {
            tasks
        });
    } else //Si no estoy logeado me manda al login
        res.redirect('/login');
});

//Endpoints de las APIS:
//Recivo un evento y lo encolo
router.post('/api/add', bodyParser.text({ type: '*/*' }), async(req, res, next) => {
    const timeStamp = Date.now();
    const protocol = req.protocol;
    const url = req.socket.remoteAddress;
    let message = JSON.parse(req.body);
    message.serverReceived = timeStamp;
    message.protocol = protocol;
    message.url = url;
    console.log("Routes@api/add: New POST from: " + protocol + '://' + url);
    console.log("Routes@api/add: Request Body: %s", message);

    console.log('Routes@api/add: Sending message to "incoming" queue. Message : %s', message);
    queue
        .send('incoming', message);

    res.end('Routes@api/add: Received ' + JSON.stringify(message));
});

//Devuelvo la lista completa de eventos
//TODO: Estoy seguro que esta no es la fomra correcta de manejarlo, que pasa si tarda o es muy grande?
router.get('/api/getlist', async(req, res, next) => {
    const timeStamp = Date.now();
    const protocol = req.protocol;
    const url = req.socket.remoteAddress;
    let query={}
    let desde= Number( req.query.desde);
    let cantidad= Number( req.query.cantidad);
    console.log("Routes@api/getlist: New GET from: " + protocol + '://' + url + "  time: " + timeStamp);
    try{
      query= JSON.parse(req.query.q || "{}");
    }catch(e){
      console.log("Routes@api/getlist badquery: " , req.query.q)
      return res.status(400).send("bad query")
    }
    console.log("Routes@api/getlist: " , req.query)
    //TODO: agregar querys mas complejos
    list(config.messageCollectionName,query,desde,cantidad)
      .then(result=> res.send(result) )
      .catch( err=> {console.log("err /api/getlist: " , err) ; res.send("error listado")} )
});

/*
router.get('/turn/:id', async(req, res, next) => {
    let { id } = req.params;
    const task = await Task.findById(id);
    task.status = !task.status;
    await task.save();
    res.redirect('/');
});

router.get('/edit/:id', async(req, res, next) => {
    const task = await Task.findById(req.params.id);
    console.log(task)
    res.render('edit', { task });
});

router.post('/edit/:id', async(req, res, next) => {
    const { id } = req.params;
    await Task.update({ _id: id }, req.body);
    res.redirect('/');
});

router.get('/delete/:id', async(req, res, next) => {
    let { id } = req.params;
    await Task.remove({ _id: id });
    res.redirect('/');
});
*/


module.exports = router;