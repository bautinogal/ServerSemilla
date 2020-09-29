import utils from '../lib/utils.js';
import math from '../lib/math.js';
import anim from '../lib/anim.js';
import table from './table/table.js';
import card from './card/card.js';
//--------------------------Dashboard---------------------------------------
var contentDiv; //Contenedor donde voy a dibujar cada pantalla...

const getCards = (data, parent) => {
    // var root = document.createElement("div");
    // var cards = [, ];
    // parent.appendChild(root);
    // for (let col = 0; col < colCount; col++) {
    //     for (let row = 0; row < rowCount; row++) {
    //         const element =
    //             cards[row, col] = element;
    //     }
    // }
    // return { root: root, cards: cards }
    var test1 = document.createElement("div");
    test1.className = "col-6";
    test1.style.backgroundColor = 'transparent';
    root.appendChild(test1);
    table.create({}, test1);

    var test2 = document.createElement("div");
    test2.className = "col-6";
    test2.style.backgroundColor = 'transparent';
    root.appendChild(test2);
    table.create({}, test2);
};

const dflt = {
    id: "id",
    company: {
        name: "Masterbus"
    },
    user: {
        name: "Admin"
    },
    categories: {
        dashboard: {
            name: "URBE TRACK",
            html: (parent) => {

                var test1 = document.createElement("div");
                test1.className = "col-6";
                test1.style.backgroundColor = 'transparent';
                root.appendChild(test1);
                table.create({ fetchPath: "api/get" }, test1);

                var test2 = document.createElement("div");
                test2.className = "col-6";
                test2.style.backgroundColor = 'transparent';
                root.appendChild(test2);
                table.create({}, test2);

                return root;
            }
        },
        basedatos: {
            name: "INTI",
            html: (parent) => {
                const margins = 10;
                var tableRoot = document.createElement("div");
                tableRoot.style.position = 'relative';
                tableRoot.style.left = margins + 'px';
                tableRoot.style.right = margins + 'px';
                tableRoot.style.top = margins + 'px';
                tableRoot.style.bottom = margins + 'px';
                tableRoot.style.width = (parent.offsetWidth - margins * 2) * 100 / parent.offsetWidth + '%';
                tableRoot.style.height = (parent.offsetHeight - margins * 2) * 100 / parent.offsetHeight + '%';
                parent.appendChild(tableRoot);
                table.create({ fetchPath: "api/get" }, tableRoot);
                return tableRoot;
            }
        },
    }
};

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
};

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
};

const setContent = (content) => {
    if (contentDiv == null) {
        console.log("setContent falló: debe inicializarlo primero!");
    } else {
        contentDiv.innerHTML = "";
        if (content)
            content(contentDiv); //dibujo el contenido dentro de contentDiv
    }
};

export default { init, setContent };