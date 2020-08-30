//Interpolacion lineal
const lerp = (from, to, interpolation) => {
    return (1 - interpolation) * from + interpolation * to;
}

//Interpolacion lineal limitada entre 0 y 1
const lerp01 = (from, to, interpolation) => {
    var result = lerp(from, to, interpolation);
    result = Math.min(result, 1);
    result = Math.max(result, 0);
    return result;
}


export default { lerp, lerp01 };