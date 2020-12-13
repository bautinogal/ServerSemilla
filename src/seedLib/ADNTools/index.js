const config = require('../../config');
const path = require('path');
const utils = require('../../lib/utils');
const github = require('../../lib/github');

// Valores dflt que va a tomar el parametro de "getAppADN"
const dftlOptions = {
    updateADN: false,
}

// Cargo el modulo ADN desde la carpeta donde se decargó
const loadModule = (ADNAbsFolder) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("ADNTools@loadModule: loading ADN from: " + ADNAbsFolder);
            const ADN = require(ADNAbsFolder);
            resolve(ADN);
        } catch (err) {
            reject(err);
        }
    });
}

// Descargo un nuevo ADN desde github
const downloadADN = (downloadADN) => {
    if (downloadADN) {
        return new Promise((resolve, reject) => {
            const user = config.ADNGitUser;
            const repo = config.ADNGitRepo;
            const token = config.ADNGitAuthToken;
            console.log("ADNTools@downloadADN: downloading 'ADN' from github repo: " + user + "/" + repo);
            github.cloneRepo(user, repo, "", token, "ADN")
                .then((res) => resolve(res))
                .catch(err => reject(err));
        });
    } else {
        return new Promise((resolve, reject) => { resolve() })
    }
}

//-------------------------------------------------------------

// Inicializo el ADN
const initADN = (ADN, options) => {
    return new Promise((resolve, reject) => {
        resolve(ADN);
    });
}

// Config final del ADN
const readyADN = (ADN, options) => {
    return new Promise((resolve, reject) => {
        if (ADN.onReady) {
            ADN.onReady()
                .then(() => resolve(ADN))
                .catch(err => reject(err));
        }
    });
}

// Me devuelve el "ADN" de la App con todas las reglas de negocios e información para su creación
const getADN = (options) => {
    options = utils.fillObjWithDflt(options, dftlOptions);
    const ADNAbsFolder = path.join(__dirname, "../../ADN");

    return new Promise((resolve, reject) => {
        downloadADN(options.updateADN)
            .then(() => loadModule(ADNAbsFolder))
            .then(ADN => resolve(ADN))
            .catch(err => reject(err));
    });
}

module.exports = { getADN, initADN, readyADN };