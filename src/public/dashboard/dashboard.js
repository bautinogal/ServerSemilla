import utils from './../utils/utils.js';

const collection = "collection1";
const headers = []; //Columnas de la tabla

//Variables de estado de la app
var data = []; // Elemento que vamos a mostrar en la tabla
var totalElementsCount = 0; // Cantidad de resultados que coinciden con el query en la db
var page = 0; // Página en la que nos encontramos actualmente


const getQuery = () => {
    return {}
}

const getQueryOptions = () => {
    return {
        "limit": page * 10 + 10,
        "skip": page * 10
    };
}

const drawTable = () => {
    console.log("draw table: data %s", data);
    console.log("draw table: totalElementsCount %s", totalElementsCount);
    console.log("draw table: page %s", page);
}

const updateView = () => {
    var query = getQuery();
    var queryOptions = getQueryOptions();

    utils.getData(collection, query, queryOptions)
        .then((res) => {
            data = res;
            console.log("data: %s", data);
            return utils.getCount(collection, query);
        })
        .then((res) => {
            totalElementsCount = res;
            console.log("count: %s", totalElementsCount);

        })
        .catch();
    drawTable();
}

updateView();