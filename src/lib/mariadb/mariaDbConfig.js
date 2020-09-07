const config = require('../../config/index');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    database : config.mariaDbName,
    host : config.mariaDbHost,
    user : config.mariaDbUser,
    password : config.mariaDbPass,
    port: config.mariaDbPort,
    rowsAsArray: true
})

const connectDatabase = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection()
            .then((conn) => {
                console.log('Connected to MariaDB. Connection ID is: ' + conn.threadId);
                resolve(conn);
            })
            .catch(err => {
                console.log('Not connected due to: ' + err);
                reject(err);
            });
    })
}

module.exports = { connectDatabase };