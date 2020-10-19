const repo = require('../../seedLib/bds');
const queue = require('../../seedLib/queues');
const crypto = require('../../lib/encryptation');
const seedUtils = require('../../lib/utils');
const mingo = require('mingo');

const cmd = repo.cmd;
const cmds = repo.cmds;

const enqueue = queue.push;

const encrypt = crypto.encrypt;
const compareEncrypted = crypto.compareEncrypted;
const createJWT = crypto.createJWT;
const decodeJWT = crypto.decodeJWT;

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

module.exports = { login, createUser, deleteUsers, cmd, cmds, enqueue, encrypt, compareEncrypted, createJWT, decodeJWT, copyFile, copyFolder, validate };