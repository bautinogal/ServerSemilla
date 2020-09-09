const config = require('../../config');
const path = require('path');
const utils = require('../../lib/utils');
const github = require('../../lib/github');

// Valores dflt que va a tomar el parametro de "getAppADN"
const dftlOptions = {
    updateADN: false,
    eraseOldADN: false //TODO: HACER QUE ESTO FUNCIONE
}

// Cargo el modulo ADN desde la carpeta donde se decargó
const loadModule = (ADNAbsFolder) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("ADNTools@loadModule: loading ADN from: " + ADNAbsFolder);
            const ADN = require(ADNAbsFolder);
            console.table(ADN);
            resolve(ADN);
        } catch (err) {
            reject(err)
        }
    });
}

// Descargo un nuevo ADN desde github
const downloadADN = () => {
    return new Promise((resolve, reject) => {
        const user = config.ADNGitUser;
        const repo = config.ADNGitRepo;
        const token = config.ADNGitAuthToken;
        console.log("ADNTools@downloadADN: downloading 'ADN' from github repo: " + user + "/" + repo);
        github.cloneRepo(user, repo, "", token, ADNAbsFolder)
            .then((res) => resolve(res))
            .catch(err => reject(err));
    });
}

// Me devuelve el "ADN" de la App con todas las reglas de negocios e información para su creación
const getADN = (options) => {
    options = utils.fillObjWithDflt(options, dftlOptions);

    const ADNRelPath = "../../ADN";
    const ADNAbsFolder = path.join(__dirname, ADNRelPath);

    return new Promise((resolve, reject) => {
        if (options.updateADN) {
            downloadADN()
                .then(loadModule(ADNAbsFolder))
                .then(res => resolve(res))
                .catch(err => reject(err));
        } else {
            loadModule(ADNAbsFolder)
                .then(res => resolve(res))
                .catch(err => reject(err));
        }
    });
}

module.exports = { getADN };