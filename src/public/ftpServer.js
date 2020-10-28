const FtpSrv = require('ftp-srv');
const ftpServer = new FtpSrv({ url: "ftp://0.0.0.0:20", greeting: "HOLA DESDE FTP" });
const path = require('path');

ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {
    console.log("FTP connection: " + connection);
    console.log("FTP user: " + username);
    console.log("FTP pass: " + password);
    try {
        if (username == "INTI" && password == "INTI-MB") {
            console.log("FTP ok!");
            const p = path.join(__dirname, "../../src/public/INTI");
            console.log(p);
            resolve({ root: p });
        } else {
            console.log("FTP failed, incorrect user or pass!");
            reject("incorrect user or pass!");
        }
    } catch (error) {
        console.log("FTP failed " + error);
        reject(error);
    }

});

ftpServer.listen()
    .then(() => {
        console.log("escuchando")
    });