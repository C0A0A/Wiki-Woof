import {
	GET_DOG_DETAIL,
	SEARCH_DOGS,
	ADD_BREED,
	GET_DB_DOGS,
	GET_TEMPERAMENTS,
	ADD_TEMPERAMENT,
	EMPTY_TEMPERAMENT_DETAIL,
} from '../actions/constants.js';

const initialState = {
	filterDogs: [],
	dogDetail: {},
	dogsCreated: [],
	temperaments: [],
	temperamentDetail: [],
};

export default function rootReducer(state = initialState, action) {
	switch (action.type) {
		case SEARCH_DOGS:
			return {
				...state,
				filterDogs: action.payload,
			};
		case GET_DOG_DETAIL:
			return {
				...state,
				dogDetail: action.payload,
			};
		case ADD_BREED:
			return {
				...state,
				dogDetail: action.payload,
			};
		case GET_DB_DOGS:
			return {
				...state,
				dogsCreated: action.payload,
			};
		case GET_TEMPERAMENTS:
			return {
				...state,
				temperaments: action.payload,
			};
		case ADD_TEMPERAMENT:
			return {
				...state,
				temperamentDetail: action.payload,
			};

		case EMPTY_TEMPERAMENT_DETAIL:
			return {
				...state,
				temperamentDetail: [],
			};
		default:
			return state;
	}
}
