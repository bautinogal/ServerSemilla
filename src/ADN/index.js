console.log("ADN cargado");

const setup = () => {
    return new Promise((resolve, reject) => {
        console.log("ADN setup!");
        resolve({});
    })
}

module.exports = { setup };