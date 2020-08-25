require('dotenv').config({ path: __dirname + '/.env' }) // Levanta las variables de entorno del archivo .env

//---------------------- Variables de Entorno --------------------------------
const vars = {
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
    rootPass: process.env.ROOT_PASS || 'secret'
}

module.exports = vars;