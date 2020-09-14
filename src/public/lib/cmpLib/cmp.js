const createContentRoot = (data) => {
    var result = {};

    var contentRoot = document.createElement("div");
    contentRoot.id = data.id + "-root";
    contentRoot.className = 'content';
    var rootRow = document.createElement("div");
    rootRow.id = data.id + "-root-row";
    rootRow.className = 'row';
    contentRoot.appendChild(rootRow);
    var rootCol = document.createElement("div");
    rootCol.id = data.id + "-root-col";
    rootCol.className = 'col-12';
    rootRow.appendChild(rootCol);

    result.html = contentRoot;

    result.addContent = (child) => {
        rootCol.appendChild(child.html);
    }

    return result;
}

const createCard = (data) => {
    var result = {};

    var cardRoot = document.createElement("div");
    cardRoot.id = data.id + "-card-root";
    cardRoot.className = 'card';

    var cardHeader = document.createElement("div");
    cardHeader.id = data.id + "-card-header";
    cardHeader.className = 'card-header';

    var cardBody = document.createElement("div");
    cardBody.id = data.id + "-card-body";
    cardBody.className = 'card-body';

    var cardFooter = document.createElement("div");
    cardFooter.id = data.id + "-card-footer";
    cardFooter.className = 'card-footer';

    cardRoot.append(cardHeader, cardBody, cardFooter);

    result.html = cardRoot;

    result.addContent = (child) => {
        cardRoot.appendChild(child.html);
    }

    return result;
}

const createTable = (data) => {
    var result = {};

    var cardRoot = document.createElement("div");
    cardRoot.id = data.id + "-card-root";
    cardRoot.className = 'card';

    var cardHeader = document.createElement("div");
    cardHeader.id = data.id + "-card-header";
    cardHeader.className = 'card-header';
    cardRoot.appendChild(cardHeader);

    result.html = cardRoot;

    result.addContent = (childHTML) => {
        cardRoot.appendChild(childHTML);
    }

    return result;
}

const cmp = (data) => {
    switch (data.type) {
        case 'root':
            return createContentRoot(data);
        case 'card':
            return createCard(data);
        case 'table':
            return createTable(data);
        default:
            return createCard(data);
    }
}

//---------------------------------------------------------------------------------------------------

const parent = document.getElementsByClassName('content')[0];

const contentRootData = {
    type: "root",
    id: "root-gases"
};

const cardData = {
    type: "card",
    id: "card-gases"
};

const tableData = {
    type: "table",
    id: "tabla-gases",
    request: {
        url: "www.sss.com",
        requestOptions: {},
        rows: []
    },
    components: {
        searchField: {
            style: {}, //Opcional, agarro el style dftl
            show: true, //Opcional
            onType: (input) => {
                console.log(input);
            }
        },
        topRightBtns: [{
            style: {}, //Opcional, agarro el style dftl
            onClick: () => {
                console.log(table.functions.showModal({}));
            }
        }],
        headers: [{
            style: {}, //Agarro el style dftl
            name: "fabricante",
            display: "Fabricante",
            showCell: (row) => {
                if ("fabricante" in row) return row['fabricante'];
                else return "-";
            }
        }, {
            style: {}, //Agarro el style dftl
            name: "tipo",
            display: "Tipo",
            showCell: (row) => {
                if ("tipo" in row) return row['tipo'];
                else return "-";
            }
        }, {
            style: {}, //Agarro el style dftl
            name: "vencimiento",
            display: "F. Vencimiento",
            showCell: (row) => {
                if ("vencimiento" in row) return row['vencimiento'];
                else return "-";
            }
        }, {
            style: {}, //Agarro el style dftl
            name: "serialNo",
            display: "No. Serie",
            showCell: (row) => {
                if ("serialNo" in row) return row['serialNo'];
                else return "-";
            }
        }],
        tableBody: {
            rows: 10,
            stripped: true
        },
        pagination: {

        }
    },
    events: {

    },
    functions: {
        showModal: (element) => {
            console.log("Showing modal with: %s", element);
        },
        updateView: (rows) => {
            console.log("Updating view with: %s", JSON.stringify(rows));
        },
        update: () => {
            fetch(table.data.url, requestOptions)
                .then((res) => {
                    rows = res;
                    console.log("fetched data: %s", JSON.stringify(rows));
                    updateView(rows);
                })
                .catch((err) => console.log(err));
        }
    },
};

var contentRoot = cmp(contentRootData);
var card = cmp(cardData);
//var table = cmp(tableData);

contentRoot.addContent(card);
//card.addContent(table);
parent.appendChild(contentRoot.html);