//const {login, get, post, encrypt, decrypt, consume } = require('./lib/index');
//const mongodb = require('../../lib/mongodb/mongoDbHelpers');
const repo = require('../../lib/repo');
const crypto = require('../../lib/encryptation');

const login = (route, query, queryOptions) => {

}

const get = (route, query, queryOptions) => {

    return new Promise((resolve, reject)=>{
        try {
            const routeElements = route.split('/');
            const database = routeElements[0];
            const collection = routeElements[1];

            repo.get(database, collection, query, queryOptions)
            .then((results)=>{
                resolve(results);
            })
            .catch((error)=>{
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
        
    });
}

const post = (route, body) => {

    return new Promise((resolve, reject)=>{

        try {
            const routeElements = route.split('/');
            const database = routeElements[0];
            const collection = routeElements[1];
            
            repo.post(database, collection, body)
            .then((results)=>{
                resolve(results);
            })
            .catch((error)=>{
                reject(error);
            });
        } catch (error) {
            reject(error)
        }
    });
}

const encrypt = (pass) => {
    return new Promise((resolve, reject)=>{
        
        crypto.hash(pass)
        .then((res)=>{
            resolve(res);
        })
        .catch((err)=>{
            reject(err);
        });  
    });
   
}

const decrypt = (token) => {
    return new Promise((resolve, reject) => {

        crypto.decodeToken(token)
        .then((decodedToken)=>{
            resolve(decodedToken);
        })
        .catch((err)=>{
            reject(err);
        });
    })


}

const consume = () => {

}

module.exports = { login, get, post, encrypt, decrypt, consume };