const dataUrl = "http://localhost:3000/api/get/";
const countUrl = "http://localhost:3000/api/getCount/";

const getData = (collection, query, queryOptions) => {
    return fetch(dataUrl + collection + "?query=" + JSON.stringify(query) + "&options=" + JSON.stringify(queryOptions))
        .then(response => response.json())
        .catch(err => console.log(err));
}

const getCount = (collection, query, queryOptions) => {
    if (query == null)
        query = {};
    if (queryOptions == null)
        queryOptions = {};
    return fetch(countUrl + collection + "?query=" + JSON.stringify(query) + "&options=" + JSON.stringify(queryOptions))
        .then(response => response.json())
        .catch(err => console.log(err));
}

const addCss = (path) => {
    var file = path.split("/").pop();

    var link = document.createElement("link");
    link.href = file.substr(0, file.lastIndexOf(".")) + ".css";
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName("head")[0].appendChild(link);
}

const fillObjWithDflt = (object, dflt) => {
    var result = {};
    Object.keys(dflt).forEach(key => {
        if (key in object)
            result[key] = object[key];
        else
            result[key] = dflt[key];
    })
    return result;
}

export default { getData, getCount, addCss, fillObjWithDflt };