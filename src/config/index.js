const path = require('path');
// Levanta las variables de entorno del archivo .env
require('dotenv').config({ path: path.join(__dirname, '.env') })

//---------------------- Variables de Entorno --------------------------------
const vars = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,

    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", // key privada que uso para hashear passwords
    jwtDfltExpires: process.env.JWT_DURATION || 3600, // Cuanto duran los tokens por dflt en segundos
    saltWorkFactor: process.env.SALT_WORK_FACTOR || 10, //A: las vueltas que usa bcrypt para encriptar las password

    queueUrl: process.env.AMQP_URI || 'amqp://localhost',

    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017', //URL del Cluster de MongoDb
    mariaDbName: process.env.MARIADB_NAME || 'semilla', //Nombre de la base de datos relacional (MySQL)
    mariaDbHost: process.env.MARIADB_HOST || 'localhost', //URL donde se aloja la base de datos relacional 
    mariaDbUser: process.env.MARIADB_USER || 'root',
    mariaDbPass: process.env.MARIADB_PASS || '',

    usersDB: process.env.USERS_DB || 'test',
    usersCollection: process.env.USERS_COLLECTION || 'users',
    rootUser: process.env.ROOT_USER || 'root',
    rootPass: process.env.ROOT_PASS || 'secret',


    ADNGitUser: process.env.ADN_GIT_USER || 'gitUser',
    ADNGitRepo: process.env.ADN_GIT_REPO || 'repo',
    ADNGitAuthToken: process.env.ADN_GIT_AUTH_TOKEN || 'token'

}

module.exports = vars;