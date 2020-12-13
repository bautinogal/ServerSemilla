const repo = require('../../seedLib/bds');
const queue = require('../../seedLib/queues');
const crypto = require('../../lib/encryptation');
const seedUtils = require('../../lib/utils');
const mingo = require('mingo');
const fetch = require('node-fetch');

const cmd = repo.cmd;
const cmds = repo.cmds;

const enqueue = queue.push;

const encrypt = crypto.encrypt;
const compareEncrypted = crypto.compareEncrypted;
const createJWT = crypto.createJWT;
const decodeJWT = crypto.decodeJWT;
const isValidToken = crypto.isValidToken;

const login = (user, pass) => {
    var findUserCmd = {
        type: "mongo",
        method: "GET",
        db: repo.users.db,
        collection: repo.users.col,
        query: { user: user }
    };

    return new Promise((res, rej) => {

        var result = {};
        cmd(findUserCmd)
            .then(founds => {
                if (!founds) rej("lib@login: Error looking for user %s in db!", user);
                else if (founds.length == 0) rej("lib@login: No user found with: %s!", user);
                else if (founds.length > 1) rej("lib@login: More than one user found with: %s", user);
                else {
                    result = founds[0];
                    return compareEncrypted(pass, result.pass);
                }
            })
            .then(correct => {
                if (correct) {
                    delete result.pass;
                    return createJWT(result);
                } else
                    rej("lib@login: Incorrect Password!");
            })
            .then(JWT => res(JWT))
            .catch(err => rej(err));
    });
};

const createUser = (data) => {
    var createUserCmd = {
        type: "mongo",
        method: "POST",
        db: repo.users.db,
        collection: repo.users.col,
        content: data
    };

    return new Promise((res, rej) => {
        if (validate(createUserCmd.content, {
                $and: [
                    { "user": { $type: "string" } },
                    { "pass": { $type: "string" } },
                    { "role": { $type: "string" } }
                ]
            })) {
            encrypt(createUserCmd.content.pass)
                .then(hashedPass => {
                    createUserCmd.content.pass = hashedPass;
                    return cmd(createUserCmd);
                })
                .then(() => res())
                .catch(err => rej(err));
        } else {
            rej("lib@createUser: new user must have fields: 'user', 'pass' and 'role'");
        }
    });
};
const deleteUsers = (query, queryOptions) => {
    var deleteUsersCmd = {
        type: "mongo",
        method: "DELETE",
        db: repo.users.db,
        collection: repo.users.col,
        query: query,
        queryOptions: queryOptions
    };

    return cmd(deleteUsersCmd);
}

const copyFile = seedUtils.copyFile;
const copyFolder = seedUtils.copyFolderContent;

const validate = (obj, query) => {
    let mingoQuery = new mingo.Query(query);
    // test if an object matches query
    return mingoQuery.test(obj);
};

const noSQLQueryValidated = (param) => {
    let validator = false;
    const props = param.body;
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            const element = props[key];
            if (typeof(element) === 'object') {
                let regex = /\$/gi;
                if (regex.test(JSON.stringify(element))) {
                    console.log("La propiedad: " + key + " " + element + " es inapropiada y no pasó la validación.");
                    delete element;
                    return false;
                } else {
                    console.log("La propiedad " + key + " " + element + " es apropiada y pasa la validación.");
                    validator = true;
                }
            } else {
                console.log("La propiedad " + key + " " + element + " no es un objeto inesperado y pasa la validación.");
                validator = true;
            }
        }
    }
    return validator;
}

const isOnlySubscribedURL = (url, urlList) => {
    //Contrastar URL con la lista...
    try {
        let validator = true;
        console.log(typeof(url));
        console.log(typeof(urlList));
        console.log(urlList);
        if (typeof(url) != "string" || typeof(urlList) != "object") {
            console.log("isOnlySubscribedURL: error with parameters types!");
            validator = false;
            return validator;
        }
        //console.log(urlList);
        for (let index = 0; index < urlList.length; index++) {
            const element = urlList[index];
            if (element.url == url) {
                validator = false;
            }
        }
        return validator;
    } catch (error) {
        console.log(error);
        validator = false;
    }
    return validator;

}

const validContent = (content)=>{
    return (typeof(content) === 'object' && content.hasOwnProperty('url') && content.hasOwnProperty('codigos'))
}

const setUTCTimezoneTo = (dateToTransform, timezone) => {
    formattedDate = new Date(dateToTransform+"Z");
    let globalTime = formattedDate.getTime();
    let localeTime =new Date(formattedDate.setTime(globalTime + (timezone*60*60*1000)));  	
    return(localeTime.toISOString().split('.')[0]);
}

const  suscribeToWebhook = (body, database, events) => {
    if (typeof(events) === 'string') {
        cmd({
                type: "mongo",
                method: "POST",
                db: database,
                collection: "webhooks", // Colección de los webhooks
                content: body
            })
            .then(() => {
                res.status(200).send(body.content.url + " suscribed to : " + JSON.stringify(events));
            })
            .catch(err => res.status(500).send(err));
    } else {
        console.log("Error con los eventos a los cuales desea suscribir!");
        res.status(403).send("Error con los eventos a los cuales desea suscribir!");
    }
}
const deleteOneWebhook = (valueToQuery, database) => {
    cmd({
        type: "mongo",
        method: "DELETE_ONE",
        db: database,
        collection: "webhooks", // Colección de los webhooks
        query: valueToQuery , // Gon: Borra el documento por la URL... (¿Debería borrar por usuario?)
        queryOptions: {}
    })
    .then((response) => {
        res.status(200).send("La URL asignada se desuscribió exitosamente. Detalles: " + response);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send("Error al procesar la solicitud: " + err);
    });
}
const updateOneWebhook = (valueToQuery, valuesToUpdate, database) => {
    cmd({
        type: "mongo",
        method: "UPDATE",
        db: database,
        collection: "webhooks", // Colección de los webhooks
        query: valueToQuery, //Filtra documentos por URL
        update: valuesToUpdate //Actualiza los valores del primer documento que cumple el filtro
    })
    .then(() => {
        res.status(200).send(JSON.stringify(valueToQuery) + " updated!");
    })
    .catch(err => res.status(500).send(err));
}
const fetchToSubscriber = (webhookURL, events, req) => {
    try {
        if(events.includes(req.body.Codigo)){
            fetch(webhookURL).then(res => {
                console.log(res);
                console.log(`posted to webhook ${webhookURL} ${req.body}`);
                res.status(200).send(`Evento/s: ${events} enviado/s a suscriptores`);
            })
            .catch(err => console.log(err));
        }
    } catch (error) {
        console.log(`Error enviando datos a los suscriptores: ${error}`);
    }
}

const fetchToWebhook = (fetchBody, webhookURL, events, req)=>{
    try {
        if (events.includes(req.body.Codigo)) {
            fetch(webhookURL, fetchBody).then(res => {
                    console.log(res);
                    console.log(`posted to webhook ${webhookURL} ${req.body}`);
                    res.status(200).send(`Evento/s: ${events} enviado/s a suscriptores`);
                })
                .catch(err => console.log(err));
        }
    } catch (err) {
        console.log(`Error reenviando a suscribers: ${err}`);
    }
}

module.exports = { login, createUser, deleteUsers, cmd, cmds, enqueue, encrypt, compareEncrypted,
     createJWT, decodeJWT, copyFile, copyFolder, validate, noSQLQueryValidated, isOnlySubscribedURL,
     validContent, setUTCTimezoneTo, suscribeToWebhook, deleteOneWebhook, updateOneWebhook, fetchToWebhook,
    fetchToSubscriber };