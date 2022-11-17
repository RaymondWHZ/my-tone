const normalize = (arr, min, max) => {
    var l = [];
    l.push((arr[0] - min) / (max - min));
    l.push((arr[1] - min) / (max - min));
    l.push((arr[2] - min) / (max - min));
  
    return l;
}

console.log(normalize([4.2, 3, 6], -1, 11));
console.log(normalize([-6.207600000000001, -6.987, -4.512 ], -60, 0));
console.log(normalize([4, 4, 4], 3, 7));


