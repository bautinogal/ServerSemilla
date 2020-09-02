const mariadb = require('mariadb');
const configMaria = require('./mariaDbConfig');
const mariaDbConfig = require('./mariaDbConfig');

function querySQL(query, queryValues) {

    configMaria.connectDatabase()
        .then((conn) => {
            // CONSULTA SQL 
            conn.query(query, queryValues)
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

//Contabiliza todos los registros con la columna COUNTABLE en la tabla TABLE y que cumplan la condicion CONDITION (en caso de no setear condicion poner '1=1')
const getCount = (countable, table, condition) => {
    querySQL("SELECT COUNT("+countable+") FROM "+table+" WHERE "+ condition);
}

module.exports = { querySQL, getCount };