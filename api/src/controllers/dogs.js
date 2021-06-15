'use strict';
const {Dog, Image, Temperament} = require('../db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {RAZASURL} = require('../../constants.js');
const {API_KEY} = process.env;
const axios = require('axios');
const {v4: newUuid} = require('uuid');
const {STORAGE_BASEURL} = require('../../constants.js');
const bucket = require('../storage.js');
const {bubbleSort} = require('../../utils.js');

function getSomeDogs(req, res) {
	const filter = req.query.filter ? req.query.filter : 'name';
	const filterValue = req.query.filtervalue ? req.query.filtervalue : '';
	const where =
		filter === 'name'
			? {name: {[Op.like]: `%${filterValue}%`}}
			: filter === 'weight'
			? {weight: {[Op.like]: `%${filterValue}%`}}
			: filter === 'height'
			? {height: {[Op.like]: `%${filterValue}%`}}
			: filter === 'life_span'
			? {life_span: {[Op.like]: `%${filterValue}%`}}
			: filter === 'image_url'
			? {'$image.urlImage$': {[Op.like]: `%${filterValue}%`}}
			: filter === 'temperament'
			? {'$temperaments.name$': {[Op.like]: `%${filterValue}%`}}
			: {};
	const order =
		req.query.orderby && !req.query.direction
			? [req.query.orderby, 'ASC']
			: req.query.orderby && req.query.direction
			? [req.query.orderby, req.query.direction]
			: ['id', 'ASC'];
	const standarOffset = req.query.offset0 ? Number(req.query.offset0) : 0;
	const standarLimit = req.query.limit > 0 ? Number(req.query.limit) : 8;

	Promise.all([
		Dog.findAll({
			where: where,
			include: [
				{model: Image, as: 'image', attributes: ['urlImage']},
				{
					model: Temperament,
					as: 'temperaments',
					attributes: ['name'],
					through: {attributes: []},
				},
			],
			order: [order],
		}),
		axios.get(`${RAZASURL}?${API_KEY}`),
	])
		.then((dogs) => {
			let dbDogs = dogs[0].length
				? dogs[0]
						.map((dog) => dog.dataValues)
						.map((dog) => {
							return {
								id: dog.id,
								name: dog.name,
								weight: dog.weight,
								height: dog.height,
								life_span: dog.life_span,
								image_url: dog.image && dog.image.urlImage,
								temperament: dog.temperaments.map((tem) => tem.name).join(', '),
							};
						})
				: [];
			let apiDogs = dogs[1].data.length
				? dogs[1].data
						.map((dog) => {
							return {
								id: dog.id,
								name: dog.name,
								weight: dog.weight.metric,
								height: dog.height.metric,
								life_span: dog.life_span,
								image_url: dog.image.url,
								temperament: dog.temperament,
							};
						})
						.filter(
							(dog) =>
								dog[filter] && dog[filter].toLowerCase().includes(filterValue)
						)
				: [];
			let dogsResult = bubbleSort(
				apiDogs.concat(dbDogs),
				order[0],
				order[1]
			).splice(standarOffset, standarLimit);
			if (!dogsResult.length)
				return res.status(404).send({
					type: 'Not found',
					error: 'The query does not return matches',
				});
			if (dogsResult.length < 8 || dogsResult.length < standarLimit)
				return res.send({
					dogs: dogsResult,
					previousUrl: `${
						process.env.BACKEND_URL
					}/dogs/?filter=${filter}&filtervalue=${filterValue}&orderby=${
						order[0]
					}&direction=${order[1]}&offset0=${
						standarOffset - standarLimit
					}&limit=${standarLimit}`,
					nextUrl: null,
				});
			const nextUrl = `${
				process.env.BACKEND_URL
			}/dogs/?filter=${filter}&filtervalue=${filterValue}&orderby=${
				order[0]
			}&direction=${order[1]}&offset0=${
				standarOffset + standarLimit
			}&limit=${standarLimit}`;
			const previousUrl = !standarOffset
				? null
				: `${
						process.env.BACKEND_URL
				  }/dogs/?filter=${filter}&filtervalue=${filterValue}&orderby=${
						order[0]
				  }&direction=${order[1]}&offset0=${
						standarOffset - standarLimit
				  }&limit=${standarLimit}`;
			return res.send({
				dogs: dogsResult,
				nextUrl,
				previousUrl,
			});
		})
		.catch((err) =>
			res.status(500).send({type: 'Internal Server Error.', error: err.message})
		);
}

function getAllDogs(req, res) {
	Promise.all([Dog.findAll(), axios.get(`${RAZASURL}?${API_KEY}`)])
		.then((dogs) => {
			let dbDogs = dogs[0].length
				? dogs[0]
						.map((dog) => dog.dataValues)
						.map((dog) => {
							return {
								id: dog.id,
								name: dog.name,
								weight: dog.weight,
								height: dog.height,
								life_span: dog.life_span,
								image_url: dog.image && dog.image.urlImage,
								temperament: dog.temperaments.map((tem) => tem.name).join(', '),
							};
						})
				: [];
			let apiDogs = dogs[1].data.length
				? dogs[1].data.map((dog) => {
						return {
							id: dog.id,
							name: dog.name,
							weight: dog.weight.metric,
							height: dog.height.metric,
							life_span: dog.life_span,
							image_url: dog.image.url,
							temperament: dog.temperament,
						};
				  })
				: [];
			return res.send(dbDogs.concat(apiDogs));
		})
		.catch((err) =>
			res.status(500).send({type: 'Internal Server Error.', error: err.message})
		);
}

function addBreed(req, res) {
	req.body = {...JSON.parse(req.body.info)};
	const {name, height, weight, life_span} = req.body;
	const temperaments =
		req.body.temperament &&
		req.body.temperament.split(',').map((item) => item.trim());
	const file = req.file;
	let itemsCreated = [];
	if (!name || !height || !weight)
		return res
			.status(400)
			.send({type: 'Bad request.', error: 'Required fields must be defined.'});
	const newBreed = life_span
		? {
				id: newUuid(),
				name,
				height,
				weight,
				life_span,
		  }
		: {
				id: newUuid(),
				name,
				height,
				weight,
		  };
	Dog.create(newBreed)
		.then((data) => {
			itemsCreated.push(data);
			if (!file && !temperaments) return data;
			if (file && !temperaments) {
				return bucket.upload(file.path, {
					destination: file.filename,
				});
			}
			let temperamentsToPromises = temperaments.map((temp) =>
				Temperament.findOrCreate({
					where: {name: temp},
				})
			);
			if (!file) {
				return Promise.all(temperamentsToPromises);
			}
			if (file) {
				return Promise.all(
					[
						bucket.upload(file.path, {
							destination: file.filename,
						}),
					].concat(temperamentsToPromises)
				);
			}
		})
		.then((data) => {
			if (data instanceof Dog) {
				itemsCreated[0].dataValues.temperament = null;
				return data;
			}
			if (data[0][0] instanceof Temperament) {
				itemsCreated[0].dataValues.temperament = temperaments.join(', ');
				let dogTemperaments = data.map((temp) =>
					temp[0].addDogs([itemsCreated[0]])
				);
				return Promise.all(dogTemperaments);
			}
			const url = data[0].name
				? STORAGE_BASEURL + data[0].name
				: STORAGE_BASEURL + data[0][0].name;
			const id = data[0].id ? data[0].id : data[0][0].id;
			const dogId = itemsCreated[0].dataValues.id;
			const newImage = {
				id,
				urlImage: url,
				dogId,
			};
			if (data[0].name) {
				itemsCreated[0].dataValues.temperament = null;
				return Image.create(newImage);
			}
			itemsCreated[0].dataValues.temperament = temperaments.join(', ');
			let dogTemperaments = data
				.slice(1)
				.map((temp) => temp[0].addDogs([itemsCreated[0]]));
			return Promise.all([Image.create(newImage), dogTemperaments]);
		})
		.then((data) => {
			data instanceof Image
				? (itemsCreated[0].dataValues.image_url = data.dataValues.urlImage)
				: data[0] instanceof Image
				? (itemsCreated[0].dataValues.image_url = data[0].dataValues.urlImage)
				: (itemsCreated[0].dataValues.image_url = null);
			return res.send(itemsCreated[0].dataValues);
		})
		.catch((err) =>
			res.status(500).send({type: 'Internal Server Error.', error: err.message})
		);
}

function findById(req, res) {
	if (req.params.id.includes('-')) {
		Dog.findByPk(req.params.id, {
			include: [
				{model: Image, as: 'image', attributes: ['urlImage']},
				{
					model: Temperament,
					as: 'temperaments',
					attributes: ['name'],
					through: {attributes: []},
				},
			],
		})
			.then((dog) => {
				if (!dog)
					return res.send({
						type: 'Not found',
						error: 'The id you are requesting does not exist',
					});
				let dogResult = dog && {
					id: dog.id,
					name: dog.name,
					weight: dog.weight,
					height: dog.height,
					life_span: dog.life_span,
					image_url: dog.image && dog.image.urlImage,
					temperament: dog.temperaments.map((tem) => tem.name).join(', '),
				};
				if (dogResult) return res.send(dogResult);
			})
			.catch((err) =>
				res
					.status(500)
					.send({type: 'Internal Server Error.', error: err.message})
			);
	} else {
		axios
			.get(`${RAZASURL}?${API_KEY}`)
			.then((dogs) => {
				let dogResult =
					dogs.data &&
					dogs.data
						.filter((dog) => dog.id === Number(req.params.id))
						.map((dog) => {
							return {
								id: dog.id,
								name: dog.name,
								weight: dog.weight.metric,
								height: dog.height.metric,
								life_span: dog.life_span,
								image_url: dog.image.url,
								temperament: dog.temperament,
							};
						});
				if (dogResult.length) return res.send(dogResult[0]);
				return res.send({
					type: 'Not found',
					error: 'The id you are requesting does not exist',
				});
			})
			.catch((err) =>
				res
					.status(500)
					.send({type: 'Internal Server Error.', error: err.message})
			);
	}
}

function getDataBaseDogs(req, res) {
	const filter = req.query.filter ? req.query.filter : 'name';
	const filterValue = req.query.filtervalue ? req.query.filtervalue : '';
	const where =
		filter === 'name'
			? {name: {[Op.like]: `%${filterValue}%`}}
			: filter === 'weight'
			? {weight: {[Op.like]: `%${filterValue}%`}}
			: filter === 'height'
			? {height: {[Op.like]: `%${filterValue}%`}}
			: filter === 'life_span'
			? {life_span: {[Op.like]: `%${filterValue}%`}}
			: filter === 'image_url'
			? {'$image.urlImage$': {[Op.like]: `%${filterValue}%`}}
			: filter === 'temperament'
			? {'$temperaments.name$': {[Op.like]: `%${filterValue}%`}}
			: {};
	Dog.findAll({
		where: where,
		include: [
			{model: Image, as: 'image', attributes: ['urlImage']},
			{
				model: Temperament,
				as: 'temperaments',
				attributes: ['name'],
				through: {attributes: []},
			},
		],
	})
		.then((data) => {
			if (!data.length) return res.send([]);
			let result = data
				.map((dog) => dog.dataValues)
				.map((dog) => {
					return {
						id: dog.id,
						name: dog.name,
						weight: dog.weight,
						height: dog.height,
						life_span: dog.life_span,
						image_url: dog.image && dog.image.urlImage,
						temperament: dog.temperaments.map((tem) => tem.name).join(', '),
					};
				});
			return res.send(result);
		})
		.catch((err) =>
			res.status(500).send({type: 'Internal Server Error.', error: err.message})
		);
}

module.exports = {
	getSomeDogs,
	addBreed,
	findById,
	getDataBaseDogs,
	getAllDogs,
};
