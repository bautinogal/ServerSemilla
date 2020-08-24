function objFilter(obj, filters) { //U:recibe los filters para limpiar el obj pasado como parametro
    let newObj = {};
    for (let key in obj) {
        if (!filters.includes(key))
            newObj[key] = obj[key];
    }
    return newObj;
}

function copy(source, deep) {
    var o, prop, type;
 
   if (typeof source != 'object' || source === null) {
     // What do to with functions, throw an error?
     o = source;
     return o;
   }
 
   o = new source.constructor();
 
   for (prop in source) {
 
     if (source.hasOwnProperty(prop)) {
       type = typeof source[prop];
 
       if (deep && type == 'object' && source[prop] !== null) {
         o[prop] = copy(source[prop]);
 
       } else {
         o[prop] = source[prop];
       }
     }
   }
   return o;
 }

module.exports = { objFilter, copy };