function removeElementFromArray(array, element){
  return array.filter(function(item) {return item !== element});
}


function assert(condition, message="") {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


function getDataValues(sheet){
  return sheet.getDataRange().getValues().slice(1);
}

function removePairValues(pairs, pair){
  return pairs.filter(item => !(item.includes(pair[0]) || item.includes(pair[1])));
}

function removePair(pairs, pair){
  return pairs.filter(item => !(item.includes(pair[0]) && item.includes(pair[1])));
}

function roundScore(score){
  return (Math.round(10000 * score)) / 10000;
}

function splitIntStringToList(intString){
  if (typeof intString === "number"){
    return [intString];
  }
  else if ((intString != "")){
    return intString.split(',').map(function(x){return parseInt(x)});
  }
  return [];
}

function getZerosArray(len){
  return new Array(len).fill(0);
}

function getMaxValueFromArray(array){
  return Math.max(...array);
}