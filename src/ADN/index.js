const repo = require('./repo');
const endpoints = require('./endpoints');
const workers = require('./workers');
const { copyFile, copyFolderContent } = require('./lib');

// Copio los archivos que necesita el front end a la carpeta public
const copyPublicFiles = (files) => {
    return new Promise((resolve, reject) => {
        copyFolderContent("public", "../public", { deleteExistingContent: false })
            .then(resolve())
            .catch(err => reject(err));
    })
};

// Incializo mi app semilla
const setup = () => {
    console.log(`adn@setup: starting!`);
    return new Promise((resolve, reject) => {
        copyPublicFiles()
            .then(() => {
                console.log(`adn@setup: complete!`);
                resolve(module.exports);
            })
            .catch(err => reject(err));
    });
};

module.exports = { repo, endpoints, workers, setup };