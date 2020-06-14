//Script que oculta el manejo de las bases de datos...
//TODO: Persistir todo en un base relacional a largo plazo
const { save, list } = require('../lib/mongodb/mongoDbHelpers');

module.exports = { save, list };