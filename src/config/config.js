//INFO: las variables que usan a lo largo del codigo, se usan las cargadas en variables de entorno o default
//TODO: VER COMO MANEJO LAS VARIABLES SEMILLAS, CUALES VAN A ENV Y CUALES A SEMILLA
const config = {

    //---------------------- Variables de Entorno --------------------------------

    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,

    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", // key privada que uso para hashear passwords
    jwtDfltExpires: process.env.JWT_DURATION || 3600, // Cuanto duran los tokens por dflt en segundos
    saltWorkFactor: process.env.SALT_WORK_FACTOR || 10, //A: las vueltas que usa bcrypt para encriptar las password

    queueUrl: process.env.AMQP_URI || 'amqp://localhost',

    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017', //URL del Cluster de MongoDb
    usersDB: process.env.USERS_DB || 'test',
    usersCollection: process.env.USERS_COLLECTION || 'users',
    rootUser: process.env.ROOT_USER || 'root',
    rootPass: process.env.ROOT_PASS || 'secret',

    //---------------------- Variables de "Semilla" ----------------------------------

    tokensCriteria: {
        "Masterbus-IOT": {
            Users: { role: "root" }, //Defino quien puede crear nuevos usuarios
            INTI: { $or: [{ role: "root" }, { role: "client" }] } //Defino quien puede leer/escribir de esta db
        }
    },
    bodysCriteria: {
        "Masterbus-IOT": {
            Users: { role: "root" }, //Defino quien puede crear nuevos usuarios
            INTI: { $or: [{ role: "root" }, { role: "client" }] } //Defino quien puede leer/escribir de esta db
        }
    }
}

module.exports = config