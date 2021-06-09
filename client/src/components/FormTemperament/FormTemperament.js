import React, {useEffect, useState} from 'react';
import './formtemperament.css';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {
	getTemperaments,
	addTemperament,
	getDogsCreated,
	searchDogs,
	emptyTemperamentDetail,
} from '../../actions/index.js';

function validate(input, dogs) {
	let errors = {};
	if (!Object.values(dogs).length) {
		errors.otros = 'No olvides elegir al menos una raza.';
		return errors;
	}
	if (
		Object.values(dogs).length &&
		!Object.values(dogs).filter((value) => value === true).length
	) {
		errors.otros = 'No olvides elegir al menos una raza.';
		return errors;
	}
	if (
		Object.values(input).length &&
		!Object.values(input).filter((value) => value === true).length &&
		!input.otros
	) {
		errors.otros = 'Asigna temperamentos a la raza.';
		return errors;
	}

	if (input.otros && !/^[A-Za-z,\s]+$/g.test(input.otros)) {
		errors.otros = 'Sólo palabras sin tilde separadas por coma.';
		return errors;
	}

	return errors;
}
export function setter(input) {
	for (const key in input) {
		if (typeof input[key] === 'boolean') {
			input[key] = false;
		} else {
			input[key] = '';
		}
	}
	return input;
}

export function FormTemperament({
	allTemperaments,
	getTemperaments,
	dogsCreated,
	addTemperament,
	temperamentDetail,
	getDogsCreated,
}) {
	useEffect(() => {
		getTemperaments();
		getDogsCreated('name', '');
		return () => {
			emptyTemperamentDetail();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	const [temperaments, setTemperaments] = useState({
		otros: '',
	});
	const [searchTemperaments, setSearchTemperaments] = useState('');
	const [dogsSelected, setDogsSelected] = useState({});
	const [filterValue, setFilter] = useState('');
	const [dogs, setDogs] = useState({});
	const [errors, setErrors] = useState({});
	const [state, setState] = useState({
		init: false,
		completed: false,
	});
	const [temperamentsList, setTemperamentsList] = useState([]);
	const [dogsList, setDogsList] = useState([]);

	function submiting(e) {
		e.preventDefault();
		let dogsEntries = Object.entries(dogs);
		let resultDogs = dogsEntries
			.map((item) => (item[1] === true ? item[0] : ''))
			.join(',');
		let temperamentsEntries = Object.entries(temperaments);
		let resultTemperaments =
			temperamentsEntries
				.map((item) => (item[1] === true ? item[0] : ''))
				.join(',') + `,${temperaments.otros}`;
		addTemperament({
			id: resultDogs,
			temperament: resultTemperaments,
		});
		getTemperaments();
		setTemperaments(setter(temperaments));
		setDogs({});
		setFilter('');
		setErrors({});
		setTemperamentsList([]);
		setState({
			completed: true,
			init: false,
		});
	}

	function handleSubmitSearch(e) {
		e.preventDefault();
		setState({
			...state,
			init: true,
		});
		setFilter('');
		setDogsSelected({});
		setDogsList([]);
		getDogsCreated('name', filterValue);
	}

	function handleChangeSearch(e) {
		if (e.target.name === 'searchTemperaments') {
			setSearchTemperaments(e.target.value);
			let temperamentsFiltered = e.target.value
				? [...allTemperaments].filter((temp) =>
						temp.toLowerCase().includes(e.target.value.toLowerCase())
				  )
				: [];
			setTemperamentsList(temperamentsFiltered);
		} else {
			setFilter(e.target.value);

			let dogsFiltered = e.target.value
				? [...dogsCreated].filter((dog) =>
						dog.name.toLowerCase().includes(e.target.value.toLowerCase())
				  )
				: [];
			setDogsList(dogsFiltered);
		}
	}
	function handleChangeId(e) {
		setDogs({
			...dogs,
			[e.target.name]: e.target.checked,
		});
		setErrors(validate({}, {...dogs, [e.target.name]: e.target.checked}));
	}
	function handleChangeTemp(e) {
		setTemperaments({
			...temperaments,
			[e.target.name]: e.target.checked,
		});
		setErrors(
			validate({...temperaments, [e.target.name]: e.target.checked}, dogs)
		);
	}
	function handleChangeDogs(e) {
		setDogsSelected({
			...dogsSelected,
			[e.target.name]: e.target.checked,
		});
		setFilter(e.target.name);
	}

	function handleChangeOtrosTemp(e) {
		setTemperaments({
			...temperaments,
			[e.target.name]: e.target.value,
		});
		setErrors(
			validate(
				{
					[e.target.name]: e.target.value,
				},
				dogs
			)
		);
	}

	return (
		<div id='global-tempertament-container'>
			<div className='divs-container-row'>
				<div className='divs-container-column'>
					<form className='form-search-container' onSubmit={handleSubmitSearch}>
						<div className='checkboxes-container'>
							<div className='search-div'>
								<input
									type='text'
									id='filterValue'
									name='filterValue'
									placeholder='Buscar raza'
									value={filterValue}
									onChange={handleChangeSearch}
								/>
							</div>
							{dogsList &&
								dogsList.map((dog, i) => (
									<label
										className='label-check'
										key={'label' + dog}
										for={dog.name + i}
									>
										<input
											id={dog.name + i}
											key={'check' + dog.name}
											type='checkbox'
											name={dog.name}
											checked={dogsSelected[dog.name]}
											onClick={handleChangeDogs}
										/>
										{dog.name}
									</label>
								))}
						</div>
						<button id='btn-buscar' className='btn-submit' type='submit'>
							BUSCAR
						</button>
					</form>
					{dogsCreated.length && state.init ? (
						dogsCreated.map((dog, i) => (
							<div key={dog.id} className='dog-container'>
								{dog.image_url && (
									<img
										key={i + '-image'}
										src={dog.image_url}
										className='img-home'
										alt={dog.name}
									/>
								)}
								<NavLink
									exact
									to={`/dogs/${dog.id}`}
									className='link-dog-detail'
								>
									{dog.name}
								</NavLink>
								<label key={'label' + dog} for={i}>
									<input
										key={'check' + dog}
										type='checkbox'
										checked={dogs[dog.id]}
										name={dog.id}
										id={dog + i}
										onClick={handleChangeId}
									/>
									Seleccionar
								</label>
								{dog.temperament ? (
									<span key={i + dog.temperament}>{dog.temperament}</span>
								) : (
									<span>Woof? Puedes agregar mi temperamento?</span>
								)}
							</div>
						))
					) : (
						<div></div>
					)}
				</div>
				<form className='form-search-container ' onSubmit={submiting}>
					<div className='checkboxes-container'>
						<div className='search-div'>
							<input
								type='text'
								name='searchTemperaments'
								placeholder='Añadir temperamentos'
								value={searchTemperaments}
								onChange={handleChangeSearch}
							/>
						</div>

						{temperamentsList &&
							temperamentsList.map((temp, i) => (
								<label className='label-check' key={'label' + temp} for={i}>
									<input
										id={temp + i}
										key={'check' + temp}
										type='checkbox'
										name={temp}
										checked={temperaments[temp]}
										onClick={handleChangeTemp}
									/>
									{temp}
								</label>
							))}
					</div>
					<div id='input-create-container'>
						<input
							type='text'
							id='newtemperaments'
							className={errors.otros ? 'search-div danger' : 'search-div'}
							name='otros'
							placeholder='Crear'
							value={temperaments.otros}
							onChange={handleChangeOtrosTemp}
						/>
						<button
							className='btn-submit'
							type='submit'
							onClick={(e) => setErrors(validate(temperaments, dogs))}
							disabled={
								Object.keys(errors).length || !state.init ? 'disabled' : ''
							}
						>
							AÑADIR
						</button>
					</div>
				</form>
			</div>
			{errors.otros && <p className='danger-alert'>{'! ' + errors.otros}</p>}
			<div id={temperamentDetail[0] ? 'form-temp-response-success' : 'null'}>
				{temperamentDetail && temperamentDetail.length && state.completed ? (
					<h3>
						¡Woof, woof! Muchas gracias por tu contribución! Observa tu creación
					</h3>
				) : null}
				{temperamentDetail && state.completed
					? temperamentDetail.map((temp, i) => (
							<NavLink
								key={i + temp + 'link'}
								exact
								to={`/dogs/${temp.dogId}`}
								className='link-created'
							></NavLink>
					  ))
					: null}
			</div>
			{temperamentDetail && !temperamentDetail.length && state.completed ? (
				<h3 className='danger-alert'>
					Woof? Algo salió mal. ¡Inténtalo de nuevo!
				</h3>
			) : null}
		</div>
	);
}

function mapStateToProps(state) {
	return {
		allTemperaments: state.temperaments,
		dogsCreated: state.dogsCreated,
		temperamentDetail: state.temperamentDetail,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getTemperaments: () => dispatch(getTemperaments()),
		addTemperament: (data) => dispatch(addTemperament(data)),
		getDogsCreated: (filter, filterValue) =>
			dispatch(getDogsCreated(filter, filterValue)),
		searchDogs: (filter, filterValue, order, direction, standarLimit) =>
			dispatch(searchDogs(filter, filterValue, order, direction, standarLimit)),
		emptyTemperamentDetail: () => dispatch(emptyTemperamentDetail()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FormTemperament);
