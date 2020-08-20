//Script que oculta el manejo de las bases de datos...
//TODO: Persistir todo en un base relacional a largo plazo
const {get, getCount, deleteMany } = require('../lib/mongodb/mongoDbHelpers');
const queue = require('../lib/queue');
const config = require('../config/config');
const crypto = require('./encryptation');
const { getSalt } = require('./encryptation');
const { hash } = require('bcrypt');

//TODO: Revisar con alguien que sepa de arquitectura si esta bien agregar el campo reqInfo...
const post = (db, collection, message, reqInfo) => {

    console.log(`Repo@post/${collection} message: ${JSON.stringify(message)} reqInfo: ${JSON.stringify(reqInfo)})`);
    message.reqInfo = reqInfo;
    queue.send('POST', db, collection, message);
};

const deleteDocuments = (db, collection, query, queryInfo, reqInfo) => {
    console.log(`Repo@delete/${collection} reqInfo: ${JSON.stringify(reqInfo)})`);
    queue.send('DELETE', db, collection, query);
};

// Si el usuario y la constraseña son correctas, devuelve toda la info del usuario menos el pass
const getUserData = (name, pass) => {
    return new Promise((resolve, reject) => {
        get(config.usersDB, config.usersCollection, { user: name }, {})
            .then((users) => {
                const elementsCount = users.length;
                if (elementsCount == 0) {
                    reject('Error: Not users found for: ' + name);
                } else if (elementsCount > 1) {
                    reject('Error: More than one user found for: ' + name);
                } else {
                    crypto.compare(pass, users[0].pass)
                        .then((res) => {
                            if (res) {
                                users[0].pass = undefined;
                                users[0].salt = undefined;
                                resolve(users[0]);
                            } else {
                                reject('Error: Does not match password for: ' + name);
                            }
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
        //Me fijo si existe el usuario
        //Me fijo si coincide la constraseña
        //Devuelvo toda la data menos el pass

    });
}

// Creacion de un nuevo usuario
const newUser = (user, reqInfo) => {
    return new Promise((resolve, reject) => {
        try {
            post(config.usersDB, config.usersCollection, user, reqInfo);
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}
//Funcion que crea usuario root
const createRootUser = () => {
    return new Promise((resolve,reject) =>{
        try {            
            var password;
            pass().then((response)=>{
                password = response;
                rootUser = {"user" : config.rootUser, "role": "root", "pass": password};
                rootUserQuery = {"role":"root"};
                //Borra todos los registros de usuarios root para asegurarme que es unico
                deleteMany(config.usersDB, config.usersCollection, rootUserQuery, {})
                .then((res)=>{
                    console.log(res);
                    return post(config.usersDB, config.usersCollection, rootUser, {});
                })
                .then((resPost)=>{
                    console.log(resPost);
                    resolve(resPost);
                })
                .catch((err)=>{
                    console.log(err);
                    reject(err);
                });
            });
 
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

const pass = () => {
    return new Promise((resolve,reject)=>{
            crypto.getSalt()
        .then((salt)=>{
            const pass =  crypto.hash(config.rootPass, salt);
            resolve(pass);
        })
        .catch((err)=>{console.log(err); reject(err)});
    });
    
} 


    

module.exports = { post, get, getCount, getUserData, newUser, createRootUser };