import utils from './../utils/utils.js';

const collection = "collection1"; //Coleccion de la db de donde vamos a sacar la data para mostrar
const headers = { //Columnas de la tabla, formato : {'Title','name'}
    'Fecha': 'fecha',
    'Código': 'codigo',
    'Descripción': "descripcion",
    'Ubicación': 'ubicacion',
    'Interno': 'interno',
    'Patente': 'patente'
};
const dataMapping = {

};

//Referencias al documento--------------------------------
const table = document.getElementById('dashboard-table');
const tableHeaders = table.getElementsByTagName('thead')[0];
const tableBody = table.getElementsByTagName('tbody')[0];
const pagination = document.getElementById('dashboard-table-pagination');
const filters = document.getElementById('dashboard-table-filters');


const getPage = () => {
    return 0;
}

const getQuery = () => {
    var formData = new FormData(filters);
    for (var pair of formData.entries()) {
        console.log(pair[0] + ' = ' + pair[1]);
    }
    return {}
}

const getQueryOptions = () => {
    var page = getPage(); // Página en la que nos encontramos actualmente
    return {
        "limit": 10,
        "skip": page * 10
    };
}

const mapDataToHeaders = (data) => {
    data.forEach(element => {
        if ('fecha' in element) {
            var date = new Date(element.fecha);
            var year = date.getFullYear();
            var month = date.getMonth();
            if (month < 10)
                month = "0" + month;
            var day = date.getDate();
            if (day < 10)
                day = "0" + day;
            var hours = date.getHours();
            if (hours < 10)
                hours = "0" + hours;
            var minutes = date.getMinutes();
            if (minutes < 10)
                minutes = "0" + minutes;
            var seconds = date.getSeconds();
            if (seconds < 10)
                seconds = "0" + seconds;
            var fecha = year + "-" + month + "-" + day;
            var hora = hours + ":" + minutes;
            for (let index = fecha.length; index <= 16; index++) {
                fecha += "\u00A0\u00A0";
            }
            element.fecha = fecha + hora;
        }
    });
    return data;
}

const updateTable = (data) => {
    console.log("dashboard@drawTable  data: %s", data);

    tableHeaders.innerHTML = [];
    let tr = document.createElement('tr');
    tableHeaders.appendChild(tr);
    Object.keys(headers).forEach(element => {
        let header = document.createElement('th');
        header.innerHTML = element;
        tr.appendChild(header);
    });

    tableBody.innerHTML = [];
    Object.values(data).forEach(element => {
        let tr = document.createElement('tr');
        tableBody.appendChild(tr);
        Object.values(headers).forEach(header => {
            let td = document.createElement('td');
            if (header in element)
                td.innerHTML = element[header];
            else
                td.innerHTML = '-';
            tr.appendChild(td);
        });
    });

}

const updatePagination = () => {

}

const updateView = () => {
    var query = getQuery();
    var queryOptions = getQueryOptions();

    utils.getData(collection, query, queryOptions)
        .then((data) => {
            data = mapDataToHeaders(data);
            updateTable(data);
            return utils.getCount(collection, query);
        })
        .then((totalCount) => {
            updatePagination(totalCount); // Cantidad de resultados que coinciden con el query en la db
        })
        .catch();
}

updateView();