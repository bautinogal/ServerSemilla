import utils from '../../lib/utils.js';

const dflt = {
    id: "noId",
    title: "INTI"
}

const create = (data, parent) => {

    const createDiv = () => {
        var div = document.createElement("div");
        div.id = data.id + "-card-div";
        div.className = "card shadow ventum-card";
        parent.appendChild(div);
        return div;
    };
    const createHeader = () => {
        var header = document.createElement("div");
        header.id = data.id + "-card-header";
        header.className = "card-header ventum-card-header";
        header.innerHTML = data.title;
        div.appendChild(header);
        return header;
    };
    const createBody = () => {
        var body = document.createElement("div");
        body.id = data.id + "-card-body";
        body.className = "card-body ventum-card-body";
        div.appendChild(body);
        return body
    };
    const createFooter = () => {
        var footer = document.createElement("div");
        footer.id = data.id + "-card-footer";
        footer.className = "card-footer ventum-card-footer";
        div.appendChild(footer);
        return footer
    };

    data = utils.fillObjWithDflt(data, dflt);

    var div = createDiv();
    var header = createHeader();
    var body = createBody();
    var footer = createFooter();

    return { div, header, body, footer };
};

export default { create };