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

    //Encryptacion JWT
    //TODO: Esto debería estar acá o en el adn?
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", // key privada que uso para hashear passwords
    jwtDfltExpires: process.env.JWT_DURATION || 3600, // Cuanto duran los tokens por dflt en segundos
    saltWorkFactor: process.env.SALT_WORK_FACTOR || 10, //A: las vueltas que usa bcrypt para encriptar las password
}

module.exports = vars;