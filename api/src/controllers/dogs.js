"use strict";
const {Dog, Image, Temperament} = require("../db");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {RAZASURL} = require("../../constants.js");
const {API_KEY} = process.env;
const axios = require('axios');
const {v4: newUuid} = require("uuid");
const {STORAGE_BASEURL} = require("../../constants.js");
const bucket = require("../storage.js");
const {bubbleSort} = require("../../utils.js");


function getSomeDogs (req, res) {
    const filter = req.query.filter ? req.query.filter : "name";
    const filterValue = req.query.filtervalue ? req.query.filtervalue : "";
    const where = filter === "name" ? {name : {[Op.like]:`%${filterValue}%`}} : filter === "weight" ? {weight : {[Op.like]:`%${filterValue}%`}} : filter === "height" ? {height : {[Op.like]:`%${filterValue}%`}} : filter === "life_span" ? {life_span : {[Op.like]:`%${filterValue}%`}} : filter === "image_url" ? {"$image.urlImage$": { [Op.like]: `%${filterValue}%` }} : filter === "temperament" ? {"$temperaments.name$": { [Op.like]: `%${filterValue}%` }} : {}
    const order = req.query.orderby ? [req.query.orderby, "ASC"] : req.query.orderby && req.query.direction ? [req.query.orderby, req.query.direction] : ["id", "ASC"];
    const mix = req.query.mix === "true" ? true : false;
    const standarOffset = !mix && req.query.offset0 ? Number(req.query.offset0) : 0;
    const standarLimit = mix ? 0 : !mix && req.query.limit > 0 ? Number(req.query.limit) : 8;
    const mixOffsetDb = mix && req.query.offset1 ? Number(req.query.offset1) : 0;
    const mixOffsetApi = mix && req.query.offset2 ? Number(req.query.offset2) : 0;
    const offsetReason = mixOffsetDb ? mixOffsetApi / mixOffsetDb : 2;
    const limitDb = mixOffsetDb || mixOffsetApi ? 8 : null;

   Promise.all([Dog.findAll({where: where, include: [{model: Image, as: "image", attributes: ["urlImage"]}, {model: Temperament, as: "temperaments", attributes:["name"], through: {attributes: []}}] , order: [order], offset: mixOffsetDb, limit: limitDb}), axios.get(`${RAZASURL}?${API_KEY}`)])
   .then(dogs => {
    let dbDogs =  dogs[0] ? dogs[0].map(dog => dog.dataValues).map(dog => {
        return {id: dog.id, name: dog.name, weight: dog.weight, height: dog.height, life_span: dog.life_span, image_url: dog.image && dog.image.urlImage, temperament: dog.temperaments.map(tem => tem.name).join(", ")}
    }) : [];
    let apiDogs = dogs[1].data ? dogs[1].data.map(dog => { 
        return {id: dog.id, name: dog.name, weight: dog.weight.metric, height: dog.height.metric, life_span: dog.life_span, image_url: dog.image.url, temperament: dog.temperament}
    }).filter(dog => dog[filter] && dog[filter].toLowerCase().includes(filterValue)) : [];
    const limitApi = dogs[0].length === 0 ? 8 : dogs[0].length > 0 && dogs[0].length < 4 ?  8 - dogs[0].length : 4;
    let apiDogsFinal = !mix ? apiDogs : mix && order[0] === "id" ? apiDogs.splice(mixOffsetApi, limitApi) : bubbleSort(apiDogs, order[0], order[1]).splice(mixOffsetApi, limitApi);
    let dogsResult =  mix ? bubbleSort(apiDogsFinal.concat(dbDogs), order[0], order[1]) : bubbleSort(apiDogsFinal.concat(dbDogs), order[0], order[1]).splice(standarOffset, standarLimit);
    const prevMixDb = !mix ? 0 : offsetReason === 1 ? 4 : offsetReason > 1 && offsetReason < 2 ? mixOffsetDb % 4 : offsetReason >= 2 ? 0 : 8;
    const prevMixApi = !mix ? 0 : offsetReason === 1 ? 4 : offsetReason > 1 && offsetReason < 2 ? 8 - prevMixDb : offsetReason >= 2 ? 8 : 0;
    const DbViews = mix ? dogs[0].length : 0;
    const ApiViews = mix ? limitApi : 0;
    if(!dogsResult.length) return res.status(404).send({type: "Not found", error: "The query does not return matches"});
    if(dogsResult.length < 8 || dogsResult.length < standarLimit) return res.send({ 
        dogs: dogsResult,
        previousUrl: `localhost:3001/dogs/?filter=${filter}&filtervalue=${filterValue}&orderby=${order[0]}&direction=${order[1]}&mix=${mix}&offset0=${standarOffset - standarLimit}&limit=${standarLimit}&offset1=${mixOffsetDb - prevMixDb}&offset2=${mixOffsetApi - prevMixApi}`,
        nextUrl: null
    });
    const nextUrl = `localhost:3001/dogs/?filter=${filter}&filtervalue=${filterValue}&orderby=${order[0]}&direction=${order[1]}&mix=${mix}&offset0=${standarOffset + standarLimit}&limit=${standarLimit}&offset1=${mixOffsetDb + DbViews}&offset2=${mixOffsetApi + ApiViews}`;
    const previousUrl = !standarOffset && !mixOffsetDb && !mixOffsetApi ? null : `localhost:3001/dogs/?filter=${filter}&filtervalue=${filterValue}&orderby=${order[0]}&direction=${order[1]}&mix=${mix}&offset0=${standarOffset - standarLimit}&limit=${standarLimit}&offset1=${mixOffsetDb - prevMixDb}&offset2=${mixOffsetApi - prevMixApi}`;
    return res.send({
        dogs: dogsResult,
        nextUrl,
        previousUrl
       });
    })
    .catch(err => res.status(400).send({type: "Bad request.", error: "The query parameters are invalid."}));
}

function addBreed (req, res) {
    const {name, height, weight, life_span} = req.body
    const temperaments = req.body.temperament && req.body.temperament.replace(/ /g, "").split("-")
    const file = req.file
    let itemsCreated = [];
    if(!name || !height || !weight) return res.status(400).send({type: "Bad request.", error: "Required fields must be defined."});
    const newBreed = {
        id: newUuid(),
        name,
        height,
        weight,
        life_span
        }
        Dog.create(newBreed)
        .then(data => {
            itemsCreated.push(data);
            if(!file && !temperaments) return data;
            if(file && !temperaments) {
                return bucket.upload(file.path, {
                    destination: file.filename
                  });
                }
            let temperamentsToPromises = temperaments.map(temp => Temperament.findOrCreate({
                    where: {name: temp}
            }));
            if(!file) {
                return Promise.all(temperamentsToPromises);
                }
            if(file) {    
                return Promise.all([bucket.upload(file.path, {
                    destination: file.filename
                  })].concat(temperamentsToPromises));
                }
        })
        .then(data => {
            if(data instanceof Dog) {
                itemsCreated[0].dataValues.temperament = null;
                return data;
            } 
            if(data[0][0] instanceof Temperament) {
                itemsCreated[0].dataValues.temperament = temperaments.join(", ");
                let dogTemperaments = data.map(temp => temp[0].addDogs([itemsCreated[0]]));
                return Promise.all(dogTemperaments);  
            }
            const url = data[0].name ? STORAGE_BASEURL + data[0].name : STORAGE_BASEURL + data[0][0].name;
            const id = data[0].id ? data[0].id : data[0][0].id;
            const dogId = itemsCreated[0].dataValues.id;
            const newImage = {
                id,
                urlImage: url,
                dogId
            }
            if(data[0].name) {
                itemsCreated[0].dataValues.temperament = null;
                return Image.create(newImage);
            }
            itemsCreated[0].dataValues.temperament = temperaments.join(", ");
            let dogTemperaments = data.slice(1).map(temp => temp[0].addDogs([itemsCreated[0]]));
            return Promise.all([Image.create(newImage), dogTemperaments]);           
         })
         .then(data => {
            data instanceof Image ? itemsCreated[0].dataValues.image_url = data.dataValues.urlImage : data[0] instanceof Image ? itemsCreated[0].dataValues.image_url = data[0].dataValues.urlImage : itemsCreated[0].dataValues.image_url = null;            
            return res.send(itemsCreated[0].dataValues);
         })
        .catch(err => res.status(500).send({type: "Internal Server Error.", error: "Data validation failed."}));
}

function findById (req, res) {
    if(typeof req.params.id === "string") {
        Dog.findByPk(req.params.id, {include: [{model: Image, as: "image", attributes: ["urlImage"]}, {model: Temperament, as: "temperaments", attributes:["name"], through: {attributes: []}}]})
        .then(dog => {
            let dogResult = dog && {id: dog.id, name: dog.name, weight: dog.weight, height: dog.height, life_span: dog.life_span, image_url: dog.image && dog.image.urlImage, temperament: dog.temperaments.map(tem => tem.name).join(", ")}
            if(dogResult) return res.send(dogResult)
        })
        .catch(err => res.status(404).send({type: "Not found", error: "The id you are requesting does not exist"}));
    }
    axios.get(`${RAZASURL}?${API_KEY}`)
    .then(dogs => {
        let dogResult = dogs.data && dogs.data.filter(dog => dog.id === Number(req.params.id)).map(dog => { return {id: dog.id, name: dog.name, weight: dog.weight.metric, height: dog.height.metric, life_span: dog.life_span, image_url: dog.image.url, temperament: dog.temperament}
        });
        if(dogResult.length) return res.send(dogResult[0]);
    })
    .catch(err => res.status(404).send({type: "Not found", error: "The id you are requesting does not exist"}));
}

module.exports = {
    getSomeDogs,
    addBreed,
    findById
}