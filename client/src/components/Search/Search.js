import React, {useState} from 'react';
import './search.css';
import {useSelector, useDispatch} from 'react-redux';
import {searchDogs, searchDogsNavigation} from '../../actions/index';

export function Search() {
	const dispatch = useDispatch();
	const filterDogs = useSelector((state) => state.filterDogs);

	const [input, setInput] = useState({
		filter: 'name',
		filterValue: '',
		order: 'id',
		direction: 'ASC',
		standarLimit: '',
	});

	function handleChange(e) {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	}
	function handleSubmit(e) {
		e.preventDefault();
		dispatch(
			searchDogs(
				input.filter,
				input.filterValue,
				input.order,
				input.direction,
				input.standarLimit
			)
		);
	}
	function handleClick(e) {
		e.target.name === 'left'
			? dispatch(searchDogsNavigation(filterDogs.previousUrl))
			: dispatch(searchDogsNavigation(filterDogs.nextUrl));
	}

	return (
		<div className='searchContainer'>
			<button
				id='pagination-button-left'
				type='button'
				className='pagination-button'
				name='left'
				onClick={handleClick}
				disabled={filterDogs.previousUrl ? '' : 'disabled'}
			></button>
			<form className='form-container' onSubmit={(e) => handleSubmit(e)}>
				<div className='search-div'>
					<select
						name='filter'
						value={input.filter}
						onChange={(e) => handleChange(e)}
					>
						<option value='name'>Raza</option>
						<option value='weight'>Peso</option>
						<option value='height'>Altura</option>
						<option value='life_span'>Esperanza de vida</option>
						<option value='temperament'>Temperamento</option>
					</select>
					<input
						type='text'
						id='filterValue'
						name='filterValue'
						placeholder='Filtrar por...'
						value={input.filterValue}
						onChange={handleChange}
					/>
				</div>
				<div className='search-div'>
					<select
						name='order'
						value={input.order}
						onChange={(e) => handleChange(e)}
					>
						<option value='id'>Estándar</option>
						<option value='name'>Raza</option>
						<option value='weight'>Peso</option>
						<option value='height'>Altura</option>
						<option value='life_span'>Esperanza de vida</option>
						<option value='temperament'>Temperamento</option>
					</select>
					<select
						name='direction'
						value={input.direction}
						onChange={(e) => handleChange(e)}
					>
						<option value='ASC'>ASC</option>
						<option value='DESC'>DESC</option>
					</select>
				</div>
				<div className='search-div'>
					<label>Mostrar:</label>
					<select
						name='standarLimit'
						value={input.standarLimit}
						onChange={(e) => handleChange(e)}
					>
						<option value='8'>8</option>
						<option value='16'>16</option>
						<option value='24'>24</option>
					</select>
				</div>
				<button className='btn-submit' type='submit'>
					BUSCAR
				</button>
			</form>
			<button
				id='pagination-button-right'
				className='pagination-button'
				type='button'
				name='right'
				onClick={handleClick}
				disabled={filterDogs.nextUrl ? '' : 'disabled'}
			></button>
		</div>
	);
}

export default Search;
