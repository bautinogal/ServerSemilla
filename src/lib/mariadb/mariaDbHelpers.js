const mariadb = require('mariadb');
const configMaria = require('./mariaDbConfig');

function querySQL(query) {

    configMaria.connectDatabase()
        .then((conn) => {
            // CONSULTA SQL 
            conn.query(query)
                .then((rows) => {
                    console.log(rows);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        })
        .catch(err => console.log(err));

}

module.exports = { querySQL };