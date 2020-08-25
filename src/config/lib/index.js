//const {login, get, post, encrypt, decrypt, consume } = require('./lib/index');
//const mongodb = require('../../lib/mongodb/mongoDbHelpers');
const repo = require('../../lib/repo');

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

const encrypt = () => {

}

const decrypt = () => {

}

const consume = () => {

}

module.exports = { login, get, post, encrypt, decrypt, consume };