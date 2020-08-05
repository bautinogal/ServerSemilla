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

export default { getData, getCount };