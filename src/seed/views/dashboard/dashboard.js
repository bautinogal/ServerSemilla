const path = require('path');
const { JSDOM } = require("jsdom"); //librería para editar archivos .html

const create = (data) => {
    const originPath = path.join(__dirname, 'dashboard.html');

    return new Promise((resolve, reject) => {
        try {
            JSDOM.fromFile(originPath)
                .then(dom => {
                    var script = dom.window.document.createElement("script");
                    script.type = "module";
                    script.innerHTML = `import dashboard from '/public/lib/dashboard/dashboard.js'; dashboard.init((${JSON.stringify(data)}));`;
                    dom.window.document.body.appendChild(script);

                    resolve(dom.serialize());
                });
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { create };