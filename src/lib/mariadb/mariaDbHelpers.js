const config = require('../../config/index');
const mariadb = require('mariadb');

const setConnection = (data) => {

    const pool = mariadb.createPool(data.pool)

    return connectDatabase(pool)
}

const connectDatabase = (pool) => {
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

module.exports = { connectDatabase, setConnection };