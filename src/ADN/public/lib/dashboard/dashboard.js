import utils from '../utils.js';
import math from '../math.js';
import anim from '../anim.js';

/*
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
const filterBtn = document.getElementById('filter-submit-btn');

const getPage = () => {
    return 0;
}

const getQuery = () => {
    var result = {};
    var formData = new FormData(filters);
    for (var pair of formData.entries()) {
        if (pair[1] != null && pair[1] != "")
            result[pair[0]] = pair[1];
    }
    console.log(result);
    return result;
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
        .catch((err) => console.log(err));
}

updateView();

filterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    updateView();
})
*/
//--------------------------Dashboard---------------------------------------
var contentDiv; //Contenedor donde voy a dibujar cada pantalla...

const dflt = {
    id: "id",
    company: {
        name: "COMPANY NAME"
    },
    user: {
        name: "USER NAME"
    },
    categories: {
        dashboard: {
            name: "DASHBOARD",
            html: (parent) => {
                var test = document.createElement("div");
                test.id = "test";
                test.style.margin = 'auto';
                test.style.marginTop = (parent.offsetHeight * 0.05) + 'px';
                test.style.marginBottom = (parent.offsetHeight * 0.05) + 'px';
                test.style.marginLeft = (parent.offsetWidth * 0.05) + 'px';
                test.style.marginRight = (parent.offsetWidth * 0.05) + 'px';
                test.style.width = (parent.offsetWidth * 0.5) + 'px';
                test.style.height = (parent.offsetHeight * 0.5) + 'px';
                test.style.color = 'red';
                test.style.backgroundColor = 'red';
                parent.appendChild(test);
                return test;
            }
        },
        ingreso: {
            name: "INGRESO",
        },
        basedatos: {
            name: "BD",
        },
    }
}

const createNav = (data) => {
    var result = {};
    var nav = document.createElement("div");
    nav.id = data.id + "-nav";
    nav.className = 'ventum-nav';
    nav.style.height = window.innerHeight + "px";

    result.html = nav;

    result.addContent = (child) => {
        nav.appendChild(child.html);
    }

    return result;
};

const createSidebar = (data) => {

    const companyInfo = () => {
        var companyDiv = document.createElement("div");
        companyDiv.id = data.id + "-sidebar-company-div";
        companyDiv.className = 'ventum-sidebar-company';

        var logoDiv = document.createElement("div");
        logoDiv.id = data.id + "-sidebar-company-logo-div";
        logoDiv.className = 'ventum-sidebar-company-logo';

        var logo = document.createElement("i");
        logo.id = data.id + "-sidebar-company-logo-icon";
        logo.className = 'icon-compass icon-2x ventum-sidebar-company-logo-i';

        logoDiv.appendChild(logo);
        companyDiv.appendChild(logoDiv);

        var nameDiv = document.createElement("div");
        nameDiv.id = data.id + "-sidebar-company-name-div";
        nameDiv.className = 'ventum-sidebar-company-name';

        var nameText = document.createElement("button");
        nameText.id = data.id + "-sidebar-company-name-text";
        nameText.className = 'ventum-sidebar-company-name-text';
        nameText.href = "";
        nameText.innerHTML = data.company.name;

        nameDiv.appendChild(nameText);
        companyDiv.appendChild(nameDiv);

        return companyDiv;
    };

    const separatorLine = () => {
        var line = document.createElement("div");
        line.className = 'ventum-sidebar-separator-line';
        return line;
    };

    const separatorSpace = (height) => {
        var companyDiv = document.createElement("div");
        companyDiv.className = 'ventum-sidebar-separator-space';
        companyDiv.style.height = (height || 3) + '%';
        return companyDiv;
    };

    const userInfo = () => {
        var userDiv = document.createElement("div");
        userDiv.id = data.id + "-sidebar-user-div";
        userDiv.className = 'ventum-sidebar-user';

        var logoDiv = document.createElement("div");
        logoDiv.id = data.id + "-sidebar-user-logo-div";
        logoDiv.className = 'ventum-sidebar-user-logo';

        var logo = document.createElement("i");
        logo.id = data.id + "-sidebar-user-logo-icon";
        logo.className = 'icon-compass icon-2x ventum-sidebar-user-logo-i';

        logoDiv.appendChild(logo);
        userDiv.appendChild(logoDiv);

        var nameDiv = document.createElement("div");
        nameDiv.id = data.id + "-sidebar-user-name-div";
        nameDiv.className = 'ventum-sidebar-user-name';

        var nameText = document.createElement("button");
        nameText.id = data.id + "-sidebar-user-name-text";
        nameText.className = 'ventum-sidebar-user-name-text';
        nameText.href = "";
        nameText.innerHTML = data.user.name;

        nameDiv.appendChild(nameText);
        userDiv.appendChild(nameDiv);

        return userDiv;
    };

    const createCat = (cat) => {
        var catDiv = document.createElement("div");
        catDiv.id = data.id + "-sidebar-main-category-div";
        catDiv.className = 'ventum-sidebar-main-category';

        var logoDiv = document.createElement("div");
        logoDiv.id = data.id + "-sidebar-main-category-logo-div";
        logoDiv.className = 'ventum-sidebar-main-category-logo';

        var logo = document.createElement("i");
        logo.id = data.id + "-sidebar-main-category-logo-icon";
        logo.className = 'icon-compass icon-2x ventum-sidebar-main-category-logo-i';

        logoDiv.appendChild(logo);
        catDiv.appendChild(logoDiv);

        var nameDiv = document.createElement("div");
        nameDiv.id = data.id + "-sidebar-main-category-name-div";
        nameDiv.className = 'ventum-sidebar-main-category-name';

        var nameText = document.createElement("button");
        nameText.id = data.id + "-sidebar-main-category-name-text";
        nameText.className = 'ventum-sidebar-main-category-name-text';
        nameText.innerHTML = cat.name;

        nameText.onclick = (e) => {
            e.preventDefault();
            console.log("Category selected: " + cat.name);
            setContent(cat.html);
        };

        nameDiv.appendChild(nameText);
        catDiv.appendChild(nameDiv);

        return catDiv;

    };

    var result = {};
    var sidebar = document.createElement("div");
    sidebar.id = data.id + "-sidebar";
    sidebar.className = 'ventum-sidebar';

    sidebar.appendChild(companyInfo());
    sidebar.appendChild(separatorLine());
    sidebar.appendChild(userInfo());
    sidebar.appendChild(separatorLine());
    sidebar.appendChild(separatorSpace(3));
    Object.keys(data.categories).forEach(key => {
        sidebar.appendChild(createCat(data.categories[key]));
    });

    result.html = sidebar;

    result.addContent = (child) => {
        sidebar.appendChild(child.html);
    }

    return result;
};

const createContent = (data) => {

    const navBar = () => {
        var navbarDiv = document.createElement("div");
        navbarDiv.id = data.id + "-content-navbar-div";
        navbarDiv.className = 'ventum-content-navbar-div';

        return navbarDiv;
    };

    const separatorLine = () => {
        var line = document.createElement("div");
        line.className = 'ventum-content-separator-line';

        return line;
    };

    var result = {};
    var content = document.createElement("div");
    content.id = data.id + "-content";
    content.className = 'ventum-content';
    content.appendChild(navBar());
    content.appendChild(separatorLine());
    var mainContent = document.createElement("div");
    mainContent.id = data.id + "-content-main";
    mainContent.className = 'ventum-main-content';
    mainContent.style.height = '91%';
    content.appendChild(mainContent);

    result.html = content;
    result.mainDiv = mainContent;

    result.addContent = (child) => {
        mainContent.appendChild(child.html);
    }

    return result;
};

const addZoomInOut = (data) => {
    var sidebarBtn = document.getElementById('ventum-sidebar-zoomBtn');
    var sidebar = document.getElementById('ventum-sidebar');
    var content = document.getElementById('ventum-content');

    const zoomSidebar = (interpol) => {
        sidebar.style.flex = math.lerp(0.15, 0.03, interpol);
        content.style.flex = math.lerp(0.85, 0.97, interpol);
    }

    sidebarBtn.addEventListener('click', function() {
        anim.lAnim(zoomSidebar, 200, () => console.log("Terminó"));
    });
}

const init = (data) => {
    var result = {};
    data = utils.fillObjWithDflt(data, dflt);

    var nav = createNav(data);
    var sidebar = createSidebar(data);
    var content = createContent(data);

    nav.addContent(sidebar);
    nav.addContent(content);

    document.body.appendChild(nav.html);
    //addZoomInOut(data);

    contentDiv = content.mainDiv;


    result.html = nav.result;
    return result;
}

const setContent = (content) => {
    if (contentDiv == null) {
        console.log("setContent falló: debe inicializarlo primero!");
    } else {
        contentDiv.innerHTML = "";
        if (content)
            content(contentDiv); //dibujo el contenido dentro de contentDiv
    }
}

export default { init, setContent };