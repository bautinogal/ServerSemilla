const config = require('../../config');
const path = require('path');
const utils = require('../../lib/utils/utils');
const github = require('../../lib/github');
const fs = require('fs');

// Valores dflt que va a tomar el parametro de "getAppADN"
const dftlOptions = {
    updateADN: false,
    eraseOldADN: false //TODO: HACER QUE ESTO FUNCIONA
}

// Me devuelve el "ADN" de la App con todas las reglas de negocios e información para su creación
const getADN = (options) => {
    options = utils.fillObjWithDflt(options, dftlOptions);

    const ADNRelPath = "../../ADN";
    const ADNAbsFolder = path.join(__dirname, ADNRelPath);

    return new Promise((resolve, reject) => {
        if (options.updateADN) {
            const user = config.ADNGitUser;
            const repo = config.ADNGitRepo;
            const token = config.ADNGitAuthToken;
            console.log("ADNTools@getAppADN: trying to download 'ADN' from git: " + user + "/" + repo);
            github.cloneRepo(user, repo, "", token, ADNAbsFolder)
                .then((res) => {
                    console.log("ADNTools@getAppADN: 'ADN' downloaded from git: " + user + "/" + repo);
                    const ADN = require(ADNAbsFolder);
                    resolve(ADN);
                })
                .catch(err => reject(err));
        } else {
            try {
                const ADN = require(ADNAbsFolder);
                resolve(ADN);
            } catch (err) {
                reject(err)
            }
        }
    });
}

module.exports = { getADN };