const config = require('../../config/envVars');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    database = config.DATABASE,
    host = config.HOST,
    user = config.USER,
    password = config.PASSWORD
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