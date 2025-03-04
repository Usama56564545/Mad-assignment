

console.log("Arrays method : ")
let array = ["Most", "common", "string", "method", "used"];
arrays = array.length;
console.log(arrays);
array.push("Allow");
console.log(array);
array.pop();
console.log(array);
array.shift();
console.log(array);
array.unshift("Usama");
console.log(array);
sp = array.splice(0, 2);
console.log(sp);
sl = array.slice(1);
console.log(sl);
let conca = [" Any ", " Person "];
console.log(array + " concatenate " + conca);
console.log(array.includes("string"));
console.log(array);
console.log(array.indexOf("method"));
console.log(array);
console.log(array.reverse());
console.log(array.sort());
console.log(array);
array.forEach((items) =>{
    console.log(items);
});
console.log(array);
// array Mapping 
let newmap = array.map((item , index) =>{
    console.log(item, index);
    return item + "Usama";
});
console.log(newmap);
console.log(array);
// array filter 
let newfilter = array.filter((items , index) =>{
    console.log(items , index)
    return index < 2;
});

console.log(newfilter);
// the origional array not modified 
console.log(array);

// array reduce 
let newreduce = array.reduce((items , values) =>{
    return items + values ; 
});
console.log(newreduce);









