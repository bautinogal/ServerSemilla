const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

function objFilter(obj, filters) { //U:recibe los filters para limpiar el obj pasado como parametro
    let newObj = {};
    for (let key in obj) {
        if (!filters.includes(key))
            newObj[key] = obj[key];
    }
    return newObj;
}

function copyObject(source, deep) {
    var o, prop, type;

    if (typeof source != 'object' || source === null) {
        // What do to with functions, throw an error?
        o = source;
        return o;
    }

    o = new source.constructor();

    for (prop in source) {

        if (source.hasOwnProperty(prop)) {
            type = typeof source[prop];

            if (deep && type == 'object' && source[prop] !== null) {
                o[prop] = copyObject(source[prop]);

            } else {
                o[prop] = source[prop];
            }
        }
    }
    return o;
}

//TODO: poder parametrizar cuantos niveles quiero copiar...
const fillObjWithDflt = (object, dflt) => {
    var result = {};

    // Si no me pasan ningun objeto devuelvo el dflt
    if (object == null) object = {}

    Object.keys(dflt).forEach(key => {
        if (key in object)
            result[key] = object[key];
        else
            result[key] = dflt[key];
    })
    return result;
}

const copyFile = (source, target) => {
    return new Promise((resolve, reject) => {
        console.log("utils@copyFile: from %s to %s", source, target);
        //Si no existe la carpeta creo una nueva...
        var path = target;
        path = target.split('/');
        path.pop();
        path = path.join();
        mkdirp(path, function(err) {
            if (err) reject(err);
            var rd = fs.createReadStream(source);
            var wr = fs.createWriteStream(target);
            // path exists unless there was an error
            rd.on('error', reject);
            wr.on('error', reject);
            wr.on('finish', resolve);
            rd.pipe(wr);
        });
    });
}

const copyFolderContent = (from, to, options) => {
    const logDir = (dir) => {
        var files = [];
        var subDirs = [];

        for (let index = 0; index < dir.length; index++) {
            if (dir[index]['type'] == 'dir')
                subDirs.push(dir[index]['name']);
            else
                files.push(dir[index]['name']);
        }
        console.log("lib@copyFolderContent: files: " + files);
        console.log("lib@copyFolderContent: sub-folders: " + subDirs);
    };
    console.log("Utils@copyFolderContent: from %s to %s", from, to);
    return new Promise((resolve, reject) => {
        fs.readdir(from, (err, files) => {
            if (err) reject(err);
            else {
                const copy = (i, length) => {
                    return new Promise((resol, rejec) => {
                        const sourcePath = path.join(from, files[i]);
                        const targetPath = path.join(to, files[i]);
                        console.log("sourcePath: %s", sourcePath);
                        if (!fs.lstatSync(sourcePath).isDirectory()) {
                            console.log("isDirectory: %s", sourcePath);
                            try {
                                if (!fs.existsSync(to))
                                    fs.mkdirSync(to, { recursive: true });
                                fs.copyFile(sourcePath, targetPath, () => {
                                    const next = i + 1;
                                    if (next < length) {
                                        copy(next, length)
                                            .then(() => resol())
                                            .catch(err => console.log(err));
                                    } else {
                                        resol();
                                    }
                                });
                            } catch (error) {
                                rejec(error);
                            }
                        } else {
                            copyFolderContent(sourcePath, targetPath, options)
                                .then(() => {
                                    const next = i + 1;
                                    if (next < length) {
                                        copy(next, length)
                                            .then(() => resol())
                                            .catch(err => rejec(err));
                                    } else {
                                        resol();
                                    }
                                })
                                .catch(err => rejec(err));
                        }
                    })
                }
                copy(0, files.length)
                    .then(() => resolve())
                    .catch(err => reject(err));
            }
        });
    });
}

module.exports = { objFilter, copy: copyObject, copyFolderContent, fillObjWithDflt, copyFile };