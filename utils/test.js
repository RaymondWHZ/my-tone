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

var vals = normalize([1270.1646, 83.966, 14.951], 20, 200);
var temp = [];
vals.forEach((val, i) => {
    if(val<0) temp[i]=0;
    else if(val>1) temp[i]=1;
    else temp[i]=val;
});
console.log(temp);


