const {Dog, Temperament} = require("../db");

function getAllTemperaments (req, res) {
    Temperament.findAll()
    .then(temperaments => {
        let result = temperaments.length ? temperaments.map(temp => temp.dataValues.name) : [];
        if(!result.length) return res.status(404).send({type: "Not found.", error: "No results."})
        return res.send(result);
    })
    .catch(err => res.status(400).send({type: "Bad request.", error: "The query parameters are invalid."}));
}

function addTemperament (req, res) {
    const temperaments = req.body.temperament.split(",").map(item => item.trim()).filter(item => item !== "");
    const idDog = req.body.id.split(",").filter(item => item !== "");

    if(!temperaments || !idDog) return res.status(400).send({type: "Bad request.", error: "Required fields must be defined."});
    let temperamentsToPromises = temperaments.map(temp => Temperament.findOrCreate({
        where: {name: temp}
    }));
    let dogsToPromises = idDog.map(id => Dog.findOne({
        where: {id: id}
    }));
    Promise.all([Promise.all(dogsToPromises)].concat(temperamentsToPromises))
    .then(data => {
        let dogTemperaments = data[0].length === 1 ? data.slice(1).map(temp => temp[0].addDogs(data[0][0])) : data.slice(1).map(temp => temp[0].addDogs(data[0]))
        return Promise.all(dogTemperaments);
    })
    .then(data => {
        let resultTemperaments = data.map(item => item[0].dataValues)
        res.send(resultTemperaments)})
    .catch(err => res.status(500).send({type: "Internal Server Error.", error: err.message}));
}

module.exports = {
    getAllTemperaments,
    addTemperament
}


