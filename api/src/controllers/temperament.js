const {Temperament} = require("../db");

function getAllTemperaments (req, res) {
    Temperament.findAll()
    .then(temperaments => temperaments.dataValues ? res.send(temperaments.dataValues) : res.status(404).send({type: "Not found.", error: "No results."}))
    .catch(err => res.status(400).send({type: "Bad request.", error: "The query parameters are invalid."}));
}

function addTemperament (req, res) {
    const temperaments = req.body.temperament.replace(/ /g, "").split("-");
    const idDog = req.params.id;
    if(!temperaments || !idDog) return res.status(400).send({type: "Bad request.", error: "Required fields must be defined."});
    let temperamentsToPromises = temperaments.map(temp => Temperament.findOrCreate({
        where: {name: temp}
    }));
    Promise.all(temperamentsToPromises)
    .then(data => {
        let dogTemperaments = data.map(temp => temp[0].addDogs([itemsCreated[0]]));
        return Promise.all(dogTemperaments);
    })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({type: "Internal Server Error.", error: "Data validation failed."}));
}

module.exports = {
    getAllTemperaments,
    addTemperament
}


