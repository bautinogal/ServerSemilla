const mariadb = require('mariadb');
const configMaria = require('./mariaDbConfig'); 



function querySQL(queries){
    
    configMaria.connectDatabase()
        .then((conn)=>{
             // CONSULTA SQL 
             conn.query(queries)
             .then((rows)=>{
                 console.log(rows);
             })
             .then((res)=>{
                 console.log(res);
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