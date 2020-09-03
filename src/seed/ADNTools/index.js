const config = require('../../config');
const path = require('path');
const utils = require('../../lib/utils/utils');
const github = require('../../lib/github');

// Valores dflt que va a tomar el parametro de "getAppADN"
const dftlOptions = {
    updateADN: false
}

// Me devuelve el "ADN" de la App con todas las reglas de negocios e información para su creación
const getAppADN = (options) => {
    options = utils.fillObjWithDflt(options, dftlOptions);
    return new Promise((resolve, reject) => {
        if (options.updateADN) {
            const user = config.ADNGitUser;
            const repo = config.ADNGitRepo;
            const token = config.ADNGitAuthToken;
            const ADNFolder = path.join(__dirname, "../../ADN");
            console.log("ADNTools@getAppADN: trying to download 'ADN' from git: " + user + "/" + repo);
            github.cloneRepo(user, repo, "", token, ADNFolder)
                .then(() => {
                    console.log("ADNTools@getAppADN: 'ADN' downloaded from git: " + user + "/" + repo);
                    resolve(require(ADNFolder));
                })
                .catch(err => reject(err));
        } else {
            try {
                resolve(require(ADNFolder));
            } catch (err) {
                reject(err)
            }
        }
    });
}

module.exports = { getAppADN };