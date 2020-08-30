import math from './math.js';

var animations = [];
var nextId = 0;

var start = null;

//corro todas las animaciones activas
const runLoop = () => {
    var now = performance.now();
    animations.forEach(anim => {
        if (anim.func(now) > 1) killAnim(anim.id);
    });
}

const killAnim = (id) => {
    for (let i = 0; i < animations.length; i++) {
        if (animations[i].id == id) animations.splice(i, 1);
    }
}

//creacion de una nueva animacion
const newAnim = (func) => {
    var anim = {};
    anim.func = func;
    anim.id = nextId;
    nextId++;
    animations.push(anim);
    return anim.id;
}

//animación lineal
const lAnim = (func, duration, cb) => {
    var start = performance.now();
    var anim = (now) => {
        var progress = (now - start) / duration;
        var value = math.lerp01(0, 1, progress);
        console.log(value);
        if (func) func(value);
        if (progress > 1) {
            if (cb) cb();
        }
        return progress;
    }

    return newAnim(anim);
}

setInterval(function() {
    runLoop();
}, 16);

export default { lAnim };