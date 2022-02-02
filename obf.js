String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};
  
const fs = require("fs");

let data = fs.readFileSync("./simple.js", {encoding:'utf8', flag:'r'});
let datArray = Array.from(String(data))

var lastCharFound = "";
var lastCharCount = 0;

function findBy(char, alt) {
    if(!alt) alt = char

    let base = 0;
    var found = [];
    while(true) {
        //console.log("Finding by", char, "and", alt)
        let loc_s = findNextChar(data, char, base);
        let loc_e = findNextChar(data, char, loc_s + 1) + 1;
        if(loc_s == undefined || loc_e == undefined) {
            //console.log("Breaking:", loc_s,loc_e)
            break;
        }
        console.log("Found both at", loc_s, "and", loc_e);
        let content = data.substr(loc_s, loc_e - loc_s);
        found.push({loc_s, loc_e, content})
        base = loc_e + 1
    }
    //console.log("findBy", found)
    return found;
}
function combineArrays(first, second, third) {
    //console.log("Combining")
    //console.log(first)
    //console.log(second)
    //console.log(third)
    first.forEach(e => second.push(e));
    if(third) third.forEach(e => second.push(e));
    return second;
}
function relocateStrings(data) {
    console.log("starting string relocation.")
    var strTableName = "relocTable";

    let res = combineArrays(findBy('"'), findBy("'"))
    console.log("Finshed looking for chars.")
    //console.log(res)
    let i = 0;
    let tmp = "";
    let table = "";
    let offset = 0;
    res.forEach(val => {
        console.log("Found string starting at", val.loc_s, "and ending at", val.loc_e, "- Contents is", val.content, "Replacing with id:", i)
        let txt = `${strTableName}[${i}]`;
        data = data.replaceBetween(val.loc_s + offset, val.loc_e + offset, txt);
        offset += txt.length - val.content.length;
        table += `${tmp}${val.content}`;
        tmp = ", ";
        ++i;
    });
    //console.log(data)

    // console.log(data)
    data = `let ${strTableName} = [${table}];\n` + data;
    //console.log(`let ${strTableName} = [${table}];\n`);
    //console.log(data)
    fs.writeFileSync("./stringRelocated.js", data)
    return data;
}
function findLocationsOfChar(data, value) {
    //console.log("Looking for", value);
    found = [];
    let i = 0;
    while(i != data.length) {
        if(data[i] == value) {
            found.push(i);
        }
        ++i;
    };
    //console.log("Found:", found)
    return found;
}
function findNextChar(data, value, offset) {
    //console.log("Looking for", value);
    let i = offset;
    while(i <= data.length) {
        //console.log(i," : [", data[i], "]")
        if(data[i] == value) {
            //console.log("FOUND returning", i)
            return i;
        }
        ++i;
    };
}

console.log("Starting scan.")
var functions = [];

function resolveFunctionLocations() {
    var starts = findLocationsOfChar(datArray, "{");
    
    var ends   = findLocationsOfChar(datArray, "}");
    console.log("Found", starts.length, "starts and", ends.length, "endings.")
    var funcLocs = [];
    if(starts.length != ends.length) {
        console.log("Code is broken or a string contains a {");
        
    }
}

//console.log(data)
//console.log(datArray)
console.log("========================")
relocateStrings(data);
//resolveFunctionLocations();

// let startFunc = findNextChar(datArray, "{")
// let nextFunc  = findNextChar(datArray, "{", startFunc)
// let testEnd   = findNextChar(datArray, "}", startFunc)
// console.log("startFunc:", startFunc)
// console.log("nextFunc:", nextFunc)
// console.log("testEnd:", testEnd)


