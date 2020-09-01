const config = require('../../config/envVars');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    database = config.DATABASE,
    host = config.HOST,
    user = config.USER,
    password = config.PASSWORD
})

const connectDatabase = () => {
   pool.getConnection()
        .then((conn)=>{
            console.log('Connected to MariaDB. Connection ID is: ' + conn.threadId);
        })
        .catch(err => {
            console.log('Not connected due to: ' + err);
        });
}

module.exports = { connectDatabase };