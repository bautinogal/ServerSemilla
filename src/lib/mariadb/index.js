const mariadb = require('mariadb');
//const { createPool } = require('mariadb');
const mariaDbHelpers = require('./mariaDbHelpers');

function querySQL(query, queryValues) {
    /*  La funcion recibe como parámetros una sentencia SQL en query, en queryValues recibe un arreglo de valores 
        en orden secuencial. Los valores pasados en queryValues son debidamente escapados y sanitizados para realizar 
        una consulta prevenida de SQLi. */
    mariaDbHelpers.connectDatabase()
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

//TODO: necesitamos esta función acá? Porque con la anterior también le podemos pasar un query que devuelva la cantidad (a diferencia de mongo que los querys solo devuelven listas)
//Contabiliza todos los registros con la columna COUNTABLE en la tabla TABLE y que cumplan la condicion CONDITION (en caso de no setear condicion poner '1=1')
const getCount = (countable, table, condition) => {
    querySQL("SELECT COUNT(" + countable + ") FROM " + table + " WHERE " + condition);
}

const query = (msg) => {
    return new Promise((resolve, reject)=>{
        qry = msg.query;
        queryValues = msg.queryValues;
        mariadb.createPool(msg.pool)
        // CONSULTA SQL 
        .query(qry, queryValues)
        .then((rows) => {
            console.log(rows);
            resolve(rows);
        })
        .catch(err => {
            console.log(err);
            reject(err)
            conn.release();
        })
    });
    
}

const setup = (data) => {
    return new Promise((resolve, reject) => {
        if (data == null) {
            console.log("Mariadb not set.");
            resolve();
        }
        try {
            mariaDbHelpers.setConnection(data)
                .then((res) => {
                    resolve(res);
                })
                .catch(e => {
                    console.log(e);
                    resolve();
                });
        } catch (err) {
            console.log(err);
            resolve();
        }
    });
}
module.exports = { query, getCount, setup };