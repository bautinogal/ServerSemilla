import utils from '../../lib/utils.js';
import card from '../card/card.js';
var state = {};


// //Referencias al documento--------------------------------
// const table = document.getElementById('dashboard-table');
// const tableHeaders = table.getElementsByTagName('thead')[0];
// const tableBody = table.getElementsByTagName('tbody')[0];
// const pagination = document.getElementById('dashboard-table-pagination');
// const filters = document.getElementById('dashboard-table-filters');
// const filterBtn = document.getElementById('filter-submit-btn');

// const getPage = () => {
//     return 0;
// }

// const getQuery = () => {
//     var result = {};
//     var formData = new FormData(filters);
//     for (var pair of formData.entries()) {
//         if (pair[1] != null && pair[1] != "")
//             result[pair[0]] = pair[1];
//     }
//     console.log(result);
//     return result;
// }

// const getQueryOptions = () => {
//     var page = getPage(); // Página en la que nos encontramos actualmente
//     return {
//         "limit": 10,
//         "skip": page * 10
//     };
// }

// const mapDataToHeaders = (data) => {
//     data.forEach(element => {
//         if ('fecha' in element) {
//             var date = new Date(element.fecha);
//             var year = date.getFullYear();
//             var month = date.getMonth();
//             if (month < 10)
//                 month = "0" + month;
//             var day = date.getDate();
//             if (day < 10)
//                 day = "0" + day;
//             var hours = date.getHours();
//             if (hours < 10)
//                 hours = "0" + hours;
//             var minutes = date.getMinutes();
//             if (minutes < 10)
//                 minutes = "0" + minutes;
//             var seconds = date.getSeconds();
//             if (seconds < 10)
//                 seconds = "0" + seconds;
//             var fecha = year + "-" + month + "-" + day;
//             var hora = hours + ":" + minutes;
//             for (let index = fecha.length; index <= 16; index++) {
//                 fecha += "\u00A0\u00A0";
//             }
//             element.fecha = fecha + hora;
//         }
//     });
//     return data;
// }

// const updateTable = (data) => {
//     console.log("dashboard@drawTable  data: %s", data);

//     tableHeaders.innerHTML = [];
//     let tr = document.createElement('tr');
//     tableHeaders.appendChild(tr);
//     Object.keys(headers).forEach(element => {
//         let header = document.createElement('th');
//         header.innerHTML = element;
//         tr.appendChild(header);
//     });

//     tableBody.innerHTML = [];
//     Object.values(data).forEach(element => {
//         let tr = document.createElement('tr');
//         tableBody.appendChild(tr);
//         Object.values(headers).forEach(header => {
//             let td = document.createElement('td');
//             if (header in element)
//                 td.innerHTML = element[header];
//             else
//                 td.innerHTML = '-';
//             tr.appendChild(td);
//         });
//     });

// }

// const updatePagination = () => {}

// const updateView = () => {
//     var query = getQuery();
//     var queryOptions = getQueryOptions();

//     utils.getData(collection, query, queryOptions)
//         .then((data) => {
//             data = mapDataToHeaders(data);
//             updateTable(data);
//             return utils.getCount(collection, query);
//         })
//         .then((totalCount) => {
//             updatePagination(totalCount); // Cantidad de resultados que coinciden con el query en la db
//         })
//         .catch((err) => console.log(err));
// }

// // updateView();

// // filterBtn.addEventListener('click', (e) => {
// //     e.preventDefault();
// //     updateView();
// // })


//TODO: Poner spinner o algo así...
const loadingModal = () => {

}

const updateView = (result) => {
    return new Promise((resolve, reject) => {});
};

const fetchData = (path, query, token) => {
    return new Promise((resolve, reject) => {
        loadingModal();
        query = utils.jsonToURLQuery(query);
        const fullURL = "/" + path + query;
        console.log(fullURL);
        fetch(fullURL, {
                method: 'GET', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Token': token
                },
                referrerPolicy: "origin-when-cross-origin"
            })
            .then(response => {
                console.log('Response:', response);
                return response.text();
            })
            .then(response => {
                console.log('Success:', response);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
};

const update = (url, query, token) => {
    return new Promise((resolve, reject) => {
        fetchData(url, query, token)
            .then(result => updateView(result))
            .then(resolve())
            .catch(err => reject(err));
    });
};

//-----------------------------------------------------------------------------------------------

const dflt = {
    id: "noID",
    filters: [{
            label: "Desde",
            inputs: {
                desde: {
                    name: "desde",
                    type: "date",
                    placeholder: "Desde",
                    value: "",
                    required: "",
                }
            },
            query: (values) => {
                return values;
            }
        },
        {
            label: "Hasta",
            inputs: {
                hasta: {
                    name: "hasta",
                    type: "date",
                    placeholder: "Hasta",
                    value: "",
                    required: "",
                }
            },
            query: (values) => {
                return values;
            }
        },
        {
            label: "Interno (ID)",
            inputs: {
                id: {
                    name: "interno",
                    type: "text",
                    placeholder: "ID",
                    value: "",
                    required: "",
                }
            },
            query: (values) => {
                return values;
            }
        },
        {
            label: "Velocidad",
            inputs: {
                desde: {
                    name: "velocidad-desde",
                    type: "number",
                    placeholder: "Desde",
                    value: "",
                    required: "",
                },
                hasta: {
                    name: "velocidad-hasta",
                    type: "number",
                    placeholder: "Hasta",
                    value: "",
                    required: "",
                }
            },
            query: (value) => {
                return value;
            }
        },
        {
            label: "Aceleración",
            inputs: {
                desde: {
                    name: "aceleracion-desde",
                    type: "number",
                    placeholder: "Desde",
                    value: "",
                    required: "",
                },
                hasta: {
                    name: "aceleracion-hasta",
                    type: "number",
                    placeholder: "Hasta",
                    value: "",
                    required: "",
                }
            },
            query: (value) => {
                return value;
            }
        }
    ],
    headers: {

        Direccion: "Dirección",
        ID: "ID",
        Fecha: "Fecha",
        Hora: "Hora",
        Longitud: "Longitud",
        Latitud: "Latitud",
        Accel: "Aceleración",
        Velocidad: "Velocidad",
        Sensor1: "S1",
        Sensor2: "S2",
        Sensor3: "S3",
        Sensor4: "S4",

    },
    data: [{
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
        {
            "Direccion": "277",
            "ID": "865067021297901",
            "OnOff": "1",
            "Fecha": "20200611",
            "Hora": 120000,
            "Latitud": "-34.582744",
            "Longitud": "-58.491359",
            "Sensor1": "",
            "Sensor2": "",
            "Sensor3": "",
            "Sensor4": "",
            "Accel": "",
            "Velocidad": "87"
        },
    ],
    emptyRow: "-",
    fetchPath: "api/get"
}

const create = (data, parent) => {

    const createFilters = () => {
        var div = document.createElement("div");
        div.id = data.id + "-table-filters";
        div.className = "ventum-table-filters ";
        cardParent.body.appendChild(div);

        var form = document.createElement("form");
        form.id = data.id + "-table-filters-form";
        form.className = "ventum-table-filters-form";
        div.appendChild(form);

        var formRow = document.createElement("div");
        formRow.id = data.id + "-table-filters-form-row";
        formRow.className = "form-row ventum-table-filters-form-row";
        form.appendChild(formRow);

        //TODO modificar para que se puedan poner mas de 5 filtros
        for (let index = 0; index < 5; index++) {
            var col = document.createElement("div");
            col.id = data.id + "-table-filters-form-col-" + index.toString();
            col.className = "col-2";
            formRow.appendChild(col);
            if (data.filters.length > index) {
                var label = document.createElement("label");
                label.id = data.id + "-table-filters-form-col-" + index.toString() + "-label";
                label.innerHTML = data.filters[index].label;
                col.appendChild(label);

                var inputs = document.createElement("div");
                inputs.className = "form-row";
                col.appendChild(inputs);

                var inputsArray = Object.values(data.filters[index].inputs);
                inputsArray.forEach(input => {
                    var inputCol = document.createElement("div");
                    switch (inputsArray.length) {
                        case 1:
                            inputCol.className = "col-12";
                            break;
                        case 2:
                            inputCol.className = "col-6";
                            break;
                        case 3:
                            inputCol.className = "col-4";
                            break;
                        case 4:
                            inputCol.className = "col-3";
                            break;
                        default:
                            inputCol.className = "col-12";
                            break;
                    }
                    inputs.appendChild(inputCol);

                    var field = document.createElement("input");
                    field.name = input.name;
                    field.type = input.type;
                    field.className = "form-control";
                    field.placeholder = input.placeholder;
                    field.value = input.value;
                    field.required = input.required;
                    inputCol.appendChild(field);
                });
            }

        }
        var col = document.createElement("div");
        col.id = data.id + "-table-filters-form-col-" + "6";
        col.className = "col-2";
        col.style.textAlign = "center";
        formRow.appendChild(col);
        var label = document.createElement("label");
        label.id = data.id + "-table-filters-form-col-" + "submit" + "-label";
        label.innerHTML = "  &nbsp";
        label.style.position = "relative";
        label.style.width = '100%';
        col.appendChild(label);
        var btn = document.createElement("button");
        btn.type = "submit";
        btn.className = "btn btn-success";
        btn.value = "submit";
        btn.innerHTML = "Filtrar";
        btn.style.position = "relative";
        btn.style.width = '90%';
        col.appendChild(btn);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const entries = Object.fromEntries(formData.entries());
            update(data.fetchPath, entries);
        });

        return div;
    };
    const createContent = () => {
        var table = document.createElement("table");
        table.id = data.id + "-table-content";
        //Ahora uso table-sm pero debería adaptarse a la contenedor...
        table.className = "table table-sm table-striped table-hover ventum-table-content";
        cardParent.body.appendChild(table);

        //Creo los headers
        var thead = document.createElement("thead");
        thead.id = data.id + "-table-headers";
        thead.className = "thead-dark";
        table.appendChild(thead);
        var tr = document.createElement("tr");
        tr.id = data.id + "-table-headers-tr";
        tr.className = "";
        thead.appendChild(tr);
        Object.keys(data.headers).forEach(key => {
            var th = document.createElement("th");
            th.id = data.id + "-table-headers-th";
            th.className = "";
            th.innerHTML = data.headers[key];
            thead.appendChild(th);
        });

        //Creo las filas
        var tbody = document.createElement("tbody");
        tbody.id = data.id + "-table-body";
        tbody.className = "";
        table.appendChild(tbody);
        data.data.forEach(row => {
            tr = document.createElement("tr");
            tr.id = data.id + "-table-body-tr";
            tr.className = "";
            tbody.appendChild(tr);
            Object.keys(data.headers).forEach(key => {
                var th = document.createElement("th");
                th.id = data.id + "-table-body-th";
                th.className = "";
                if (key in row) {
                    if (row[key] == "")
                        th.innerHTML = data.emptyRow;
                    else
                        th.innerHTML = row[key];
                } else {
                    th.innerHTML = data.emptyRow;
                }
                tr.appendChild(th);
            });
        });

        return table;
    };
    const createFooter = () => {
        var nav = document.createElement("nav");
        nav.id = data.id + "-card-footer-nav";
        nav.className = "ventum-table-footer";
        cardParent.footer.appendChild(nav);

        var ul = document.createElement("ul");
        ul.id = data.id + "-card-footer-ul";
        ul.className = "pagination ventum-table-footer-ul";
        nav.appendChild(ul);

        for (let index = 0; index < 10; index++) {
            var li = document.createElement("li");
            li.className = "page-item";
            ul.appendChild(li);
            var button = document.createElement("button");
            button.className = "page-link ventum-pagination-btn";
            button.innerHTML = (index + 1).toString();
            li.appendChild(button);
        }

        return nav;
    };

    data = utils.fillObjWithDflt(data, dflt);
    const cardParent = card.create(data, parent);

    var filters = createFilters();
    var content = createContent();
    var footer = createFooter();

    state.dbURL = data.dbURL;

    return { filters, content, footer }
};

export default { create };