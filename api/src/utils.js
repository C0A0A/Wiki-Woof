function getApiTemperaments (array) {
    let arrFinal = [];
    array.forEach(dog => dog.temperament && dog.temperament.replace(/ /g, "").split(",")
    .forEach(temperament => arrFinal.push(temperament)));
    const uniques = arrFinal.filter((valor, indice) => {
        return arrFinal.indexOf(valor) === indice;
    });  
    return uniques;
}

function bubbleSort(array, prop, order) {
    if (!Array.isArray(array)) return []
    var swap = true;
    while(swap) {
     var swap = false;
      for(var i= 0; i < array.length-1; i++) {   
        if(array[i][prop] > array[i+1][prop]) { 
          var ref = array[i];
          array[i] = array[i+1];     
          array[i+1] = ref;
          swap = true;
        }
      }
    }
    if(order === "ASC") return array;
    return array.reverse()
    }

module.exports = {
    getApiTemperaments,
    bubbleSort
}