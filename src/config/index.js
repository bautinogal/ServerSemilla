// Levanta las variables de entorno del archivo .env
require('dotenv').config({ path: require('path').join(__dirname, '.env') })

//---------------------- Variables de Entorno --------------------------------
let vars = {
    //General
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    pwd: process.env.PWD || "",
    //ADN
    ADNGitUser: process.env.ADN_GIT_USER || 'VentumSoftware', // <ADN-GIT-USER>
    ADNGitRepo: process.env.ADN_GIT_REPO || 'ADN-Masterbus-IOT', // <ADN-GIT-USER-REPO>
    ADNGitAuthToken: process.env.ADN_GIT_AUTH_TOKEN || '3a1ac47be5a730bb221aa6a5387e7658a3f79704', // <AUTH-TOKEN>

    //Usuarios
    usersDB: process.env.USERS_DB || 'test',
    usersCollection: process.env.USERS_COLLECTION || 'users',
    rootUser: process.env.ROOT_USER || 'root',
    rootPass: process.env.ROOT_PASS || 'secret',

    //Encryptacion JWT
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", // key privada que uso para hashear passwords
    jwtDfltExpires: process.env.JWT_DURATION || 3600, // Cuanto duran los tokens por dflt en segundos
    saltWorkFactor: process.env.SALT_WORK_FACTOR || 10, //A: las vueltas que usa bcrypt para encriptar las password

    //Cola AMQP
    queueUrl: process.env.AMQP_URI || 'amqp://localhost', //URL de la cola AMQP

    //MongoDB
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017', //URL del Cluster de MongoDb
    // mongoUri: process.env.MONGODB_PUBLIC_KEY || 'CXSIZTBG', // Clave pública del Cluster de MongoDb
    // mongoUri: process.env.MONGODB_PRIVATE_KEY || 'b25b1b51-72dd-4da3-9aea-c64f12437e966', // Clave privada del 

    //TODO: ver si usamos user/pass o ssh
    //MariaDB
    mariaDbName: process.env.MARIADB_NAME || 'semilla', //Nombre de la base de datos relacional (MySQL)
    mariaDbHost: process.env.MARIADB_HOST || 'localhost', //URL del servidor remoto donde se aloja la base de datos relacional 
    mariaDbUser: process.env.MARIADB_USER || 'root',
    mariaDbPass: process.env.MARIADB_PASS || '',
    mariaDbPort: process.env.MARIADB_PORT || '3306', // Puerto de la base de datos alojada en servidor remoto
}

module.exports = vars;