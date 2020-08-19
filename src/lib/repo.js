//Script que oculta el manejo de las bases de datos...
//TODO: Persistir todo en un base relacional a largo plazo
const {get, getCount } = require('../lib/mongodb/mongoDbHelpers');
const queue = require('../lib/queue');
const config = require('../config/config');

//TODO: Revisar con alguien que sepa de arquitectura si esta bien agregar el campo reqInfo...
const post = (collection, message, reqInfo) => {
    console.log(`Repo@post/${collection} message: ${JSON.stringify(message)} reqInfo: ${JSON.stringify(reqInfo)})`);
    message.reqInfo = reqInfo;
    queue.send(collection, message);
};

// Si el usuario y la constraseña son correctas, devuelve toda la info del usuario menos el pass
const getUserData = (name, pass) => {
    var user = {};
    return new Promise((resolve, reject) => {
        get(config.usersDB, config.usersCollection, {user: name}, {})
        .then((users)=>{
            const elementsCount = users.length;
            if (elementsCount == 0){
                reject('Error: Not users found for: ' + name);
            } else if(elementsCount>1) {
                reject('Error: More than one user found for: ' + name);
            }else {
                if(pass==users[0].pass){
                    users[0].pass = null;
                    resolve(users[0]);
                }else{
                    reject('Error: Does not match password for: ' + name);
                }
            }
        })        
        .catch((err)=>{
            console.log(err);
            reject(err);
        });
        //Me fijo si existe el usuario
        //Me fijo si coincide la constraseña
        //Devuelvo toda la data menos el pass
    
    });
}

// Creacion de un nuevo usuario
const newUser = async(user) => {
    var result = {};
    repo.get()
        //Me fijo si existe el usuario
        //Me fijo si coincide la constraseña
        //Devuelvo toda la data menos el pass
    return result;
}

module.exports = { post, get, getCount, getUserData };