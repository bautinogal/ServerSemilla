//Librería que usamos para descargar repos de github

//TODO: ver validaciones loggin/authorizacion
const fetch = require('node-fetch');
const fs = require('fs');
const pathTool = require('path');

// ESCRIBE EL ARCHIVO EN LA RUTA CON EL NOMBRE Y FORMATO LA DATA QUE SE DESCARGA DEL GITHUB 
//TODO: ver de sacar todos los "syncs" para no bloquear la ejecución del progrma
function saveFile(data, folder, filename) {
    return new Promise((resolve, reject) => {
        console.log(`github@saveFile: Trying to save: ${filename} in ${folder}`);
        try {
            if (!fs.existsSync(folder))
                fs.mkdirSync(folder, { recursive: true }, err => { if (err) throw err });

            fs.writeFileSync(pathTool.join(folder, filename), data);
            console.log(`github@saveFile: saved: ${filename} in ${folder}`);
            resolve('ok');

        } catch (error) {
            reject(error);
        }
    });
};

// TODO: Te tiene que avisar que paso con el token si pudo acceder o fallo
// TODO: Configurar para recibir una carpeta con archivos e iterar sobre los archivos
const cloneRepo = (owner, repository, path, authToken, folder) => {

    //Loggeo la info de la carpeta de forma ordenada
    const logDir = (dir) => {
        var files = [];
        var subDirs = [];

        for (let index = 0; index < dir.length; index++) {
            if (dir[index]['type'] == 'dir')
                subDirs.push(dir[index]['name']);
            else
                files.push(dir[index]['name']);
        }
        console.log("github@cloneRepo: files: " + files);
        console.log("github@cloneRepo: sub-folders: " + subDirs);
    }

    return new Promise((resolve, reject) => {
        const apiUrl = "https://api.github.com/repos/" + owner + "/" + repository + "/contents/" + path;

        console.log("github@cloneRepo: cloning repo from: " + apiUrl);
        fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'Bearer ' + authToken
                }
            })
            .then(response => response.json())
            .then((json) => {
                console.log(json);
                logDir(json);
                //A: descargo de a uno los archivos/carpetas del directorio
                // https://stackoverflow.com/questions/40328932/javascript-es6-promise-for-loop/40329190
                const download = (i, length) => {
                    return new Promise((resol, reject) => {
                        try {
                            if (json[i]['type'] != 'dir') {
                                fetch(json[i]['download_url'])
                                    .then(res => res.buffer())
                                    .then((data) => saveFile(data, folder, json[i]['name']))
                                    .then(() => {
                                        const next = i + 1;
                                        if (next < length) {
                                            download(next, length)
                                                .then(() => resol())
                                                .catch(err => console.log(err));
                                        } else {
                                            resol()
                                        }

                                    })
                                    .catch((err) => reject(err));
                            } else {
                                //Si es directorio cambia el path al directorio y obtiene los archivos.
                                const subFolder = json[i]['name'];
                                cloneRepo(owner,
                                        repository,
                                        path + '/' + subFolder,
                                        authToken,
                                        pathTool.join(folder, subFolder))
                                    .then(() => {
                                        const next = i + 1;
                                        if (next < length) {
                                            download(next, length)
                                                .then(() => resol())
                                                .catch(err => console.log(err));
                                        } else {
                                            resol()
                                        }

                                    })
                                    .catch((err) => reject(err));
                            }
                        } catch (error) {
                            console.log(error);
                            reject(error);
                        }

                    })
                }

                return download(0, json.length);
            })
            .then(() => resolve())
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports = { saveJsonFile: saveFile, cloneRepo }