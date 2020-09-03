//const {login, get, post, encrypt, decrypt, consume } = require('./lib/index');
//const mongodb = require('../../lib/mongodb/mongoDbHelpers');
const repo = require('../../lib/repo');
const crypto = require('../../lib/encryptation');
const config = require('../../config/envVars')

const login = (user, pass) => {
    return new Promise((resolve, reject) => {
        try {
            get(config.usersDB + "/" + config.usersCollection, { 'user': user }, {})
                .then((users) => {
                    const elementsCount = users.length;
                    if (elementsCount == 0) {
                        reject('Error: Not user found for: ' + user);
                    } else if (elementsCount > 1) {
                        reject('Error: More than one user found for: ' + user + ", user.user must be a unique identifier!");
                    } else {
                        crypto.compare(pass, users[0].pass)
                            .then((res) => {
                                if (res) {
                                    delete users[0].pass;
                                    console.log("getUserData %s", users[0]);
                                    resolve(users[0]);
                                } else {
                                    reject('Error: Does not match password for: ' + user);
                                }
                            })
                            .catch((err) => reject(err));
                    }
                })
                .catch((err) => {
                    reject(err);
                });

        } catch (error) {
            reject(error);
        }
    })

}

const get = (route, query, queryOptions) => {

    return new Promise((resolve, reject) => {
        try {
            const routeElements = route.split('/');
            const database = routeElements[0];
            const collection = routeElements[1];

            repo.get(database, collection, query, queryOptions)
                .then((results) => {
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }

    });
}

const post = (route, body) => {

    return new Promise((resolve, reject) => {

        try {
            const routeElements = route.split('/');
            const database = routeElements[0];
            const collection = routeElements[1];

            repo.post(database, collection, body)
                .then((results) => {
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error)
        }
    });
}

const encrypt = (pass) => {
    return new Promise((resolve, reject) => {

        crypto.hash(pass)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });

}

const decrypt = (token) => {
    return new Promise((resolve, reject) => {

        crypto.decodeToken(token)
            .then((decodedToken) => {
                resolve(decodedToken);
            })
            .catch((err) => {
                reject(err);
            });
    })


}

const consume = () => {

}

module.exports = { login, get, post, encrypt, decrypt, consume };