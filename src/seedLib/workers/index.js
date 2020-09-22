var queue = require('../queues');
var workers = [];

//TODO: BORRAR WORKERS VIEJOS
//TODO: VER QUE PASA SI SE CAEN LOS WORKERS ACTUALES
//los workers comienzan a escuchar a las colas
const setup = (ADN) => {
    return new Promise((resolve, reject) => {
        try {
            workers = ADN.workers;
            if (workers)
                workers.forEach(worker => {
                    queue.consume(worker.queue, worker.work);
                });
            resolve(ADN);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { setup };