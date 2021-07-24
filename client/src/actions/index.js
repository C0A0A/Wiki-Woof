import {
	GET_DOG_DETAIL,
	SEARCH_DOGS,
	ADD_BREED,
	GET_DB_DOGS,
	GET_TEMPERAMENTS,
	ADD_TEMPERAMENT,
	EMPTY_TEMPERAMENT_DETAIL,
} from './constants.js';

export function searchDogs(
	filter = 'name',
	filterValue = '',
	order = 'id',
	direction = 'ASC',
	standarLimit = 8
) {
	return function (dispatch) {
		// eslint-disable-next-line
		return fetch(
			`${process.env.REACT_APP_BACKEND_URL}/dogs/?` +
				`filter=${filter}&` +
				`filtervalue=${filterValue}&` +
				`orderby=${order}&` +
				`direction=${direction}&` +
				`limit=${standarLimit}`
		)
			.then((response) => response.json())
			.then((json) => {
				dispatch({type: SEARCH_DOGS, payload: json});
			})
			.catch((err) => err);
	};
}

export function searchDogsNavigation(url) {
	return function (dispatch) {
		return fetch(url)
			.then((response) => response.json())
			.then((json) => {
				dispatch({type: SEARCH_DOGS, payload: json});
			})
			.catch((err) => err);
	};
}

export function getDogDetail(id) {
	return function (dispatch) {
		return fetch(`${process.env.REACT_APP_BACKEND_URL}/dogs/` + id)
			.then((response) => response.json())
			.then((json) => {
				dispatch({type: GET_DOG_DETAIL, payload: json});
			})
			.catch((err) => err);
	};
}

export function getDogsCreated(filter = 'name', filterValue = '') {
	// eslint-disable-next-line
	return function (dispatch) {
		return fetch(
			`${process.env.REACT_APP_BACKEND_URL}/dbdogs?` +
				`filter=${filter}&` +
				`filtervalue=${filterValue}`
		)
			.then((response) => response.json())
			.then((json) => {
				dispatch({type: GET_DB_DOGS, payload: json});
			})
			.catch((err) => err);
	};
}

export function addBredd(data) {
	return function (dispatch) {
		return fetch(`${process.env.REACT_APP_BACKEND_URL}/dogs`, {
			method: 'POST',
			body: data,
			headers: {
				Accept: 'application/json',
			},
		})
			.then((response) => response.json())
			.then((json) => {
				dispatch({type: ADD_BREED, payload: json});
			})
			.catch((err) => err);
	};
}

export function getTemperaments() {
	return function (dispatch) {
		return fetch(`${process.env.REACT_APP_BACKEND_URL}/temperament`)
			.then((response) => response.json())
			.then((json) => {
				dispatch({type: GET_TEMPERAMENTS, payload: json});
			})
			.catch((err) => err);
	};
}

export function addTemperament(data) {
	return function (dispatch) {
		return fetch(`${process.env.REACT_APP_BACKEND_URL}/temperament`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((json) => {
				dispatch({type: ADD_TEMPERAMENT, payload: json});
			})
			.catch((err) => err);
	};
}

export function emptyTemperamentDetail() {
	return {type: EMPTY_TEMPERAMENT_DETAIL, payload: []};
}
