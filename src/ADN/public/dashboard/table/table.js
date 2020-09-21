import utils from '../../lib/utils.js';
import card from '../card/card.js';

// const collection = "collection1"; //Coleccion de la db de donde vamos a sacar la data para mostrar
// const headers = { //Columnas de la tabla, formato : {'Title','name'}
//     'Fecha': 'fecha',
//     'Código': 'codigo',
//     'Descripción': "descripcion",
//     'Ubicación': 'ubicacion',
//     'Interno': 'interno',
//     'Patente': 'patente'
// };
// const dataMapping = {

// };

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


/* <div class="card text-center">
  <div class="card-header">
    <ul class="nav nav-pills card-header-pills">
      <li class="nav-item">
        <a class="nav-link active" href="#">Active</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div> */


{
    /* <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td colspan="2">Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody> */
}



const dflt = {
    id: "noID",
    headers: {
        col1: "col1",
        col2: "col2",
        col3: "col3",
        col4: "col4",
    },
    data: [
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
        { col1: "hola", col2: "chau", col3: "asd", col4: "aswww" },
    ],
    emptyRow: "-"
}

const create = (data, parent) => {

    const createFilters = () => {
        var div = document.createElement("div");
        div.id = data.id + "-table-filters";
        div.className = "ventum-table-filters ";
        cardParent.body.appendChild(div);
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
                    th.innerHTML = row[key];
                } else {
                    th.innerHTML = emptyRow;
                }
                tr.appendChild(th);
            });
        });

        return table;
    };
    const createFooter = () => {
        var div = document.createElement("div");
        div.id = data.id + "-card-div";
        div.className = "card shadow ventum-card";
        cardParent.footer.appendChild(div);
        return div;
    };

    data = utils.fillObjWithDflt(data, dflt);
    const cardParent = card.create(data, parent);

    var filters = createFilters();
    var content = createContent();
    //var footer = createFooter();

    return { filters, content }
};

export default { create };