const {Dog, Temperament} = require("../db");

function getAllTemperaments (req, res) {
    Temperament.findAll()
    .then(temperaments => temperaments.dataValues ? res.send(temperaments.dataValues) : res.status(404).send({type: "Not found.", error: "No results."}))
    .catch(err => res.status(400).send({type: "Bad request.", error: "The query parameters are invalid."}));
}

function addTemperament (req, res) {
    console.log(req.body)
    const temperaments = req.body.temperament.replace(/ /g, "").split("-");
    const idDog = req.query.id;
    if(!temperaments || !idDog) return res.status(400).send({type: "Bad request.", error: "Required fields must be defined."});
    let temperamentsToPromises = temperaments.map(temp => Temperament.findOrCreate({
        where: {name: temp}
    }));
    Promise.all([Dog.findOne({where: {id: idDog}})].concat(temperamentsToPromises))
    .then(data => {
        let dogTemperaments = data.slice(1).map(temp => temp[0].addDogs(data[0]));
        return Promise.all(dogTemperaments);
    })
    .then(data => res.send(temperaments))
    .catch(err => res.status(500).send({type: "Internal Server Error.", error: "Data validation failed."}));
}

module.exports = {
    getAllTemperaments,
    addTemperament
}


