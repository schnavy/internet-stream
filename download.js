let fs = require("fs");

let rawdata = fs.readFileSync("history.json");
let data = JSON.parse(rawdata);


let onlyURLs = []
let shortU;
data.forEach(elem => {
    shortU = elem.url.split("/")

    if(shortU[0][0]!= "f"){
    onlyURLs.push(shortU[2])
}
});


onlyURLs.sort()

onlyURLs = uniq(onlyURLs);

let r = Math.floor(Math.random()*onlyURLs.length)


console.log(onlyURLs[r]);
console.log(r);

function uniq(a) {
    // console.log("Doppelte gelöscht");
    return Array.from(new Set(a));
  }
  