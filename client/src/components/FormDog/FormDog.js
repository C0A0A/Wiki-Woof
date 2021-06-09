import React, {useEffect} from 'react';
import './formdog.css';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {addBredd, getDogsCreated, getDogDetail} from '../../actions/index.js';
import {setter} from '../FormTemperament/FormTemperament.js';
import {FcAddImage} from 'react-icons/fc';

export function validate(obj, dogs) {
	let errors = {};
	if (!obj.name) {
		errors.name = 'Campo requerido.';
		return errors;
	}
	if (obj.name && !/^[A-Za-z\s]+$/g.test(obj.name)) {
		errors.name = 'Sólo palabras sin tilde.';
		return errors;
	}
	if (
		obj.name &&
		dogs.length &&
		dogs.find(
			(dog) => dog.name.toLowerCase().trim() === obj.name.toLowerCase().trim()
		)
	) {
		errors.name = 'La raza ya existe.';
		return errors;
	}
	if (!obj.weight) {
		errors.weight = 'Campo requerido.';
		return errors;
	}
	if (obj.weight && !/[0-9-]+$/.test(obj.weight)) {
		errors.weight = 'Sólo un rango de números, ejemplo: 5 - 8';
		return errors;
	}
	if (!obj.height) {
		errors.height = 'Campo requerido.';
		return errors;
	}
	if (obj.height && !/[0-9-]+$/.test(obj.height)) {
		errors.height = 'Sólo un rango de números, ejemplo: 5 - 8';
		return errors;
	}
	if (obj.temperament && !/^[A-Za-z,\s]+$/g.test(obj.temperament)) {
		errors.temperament = 'Sólo palabras sin tilde separadas por coma.';
		return errors;
	}
	if (
		obj.file &&
		(!/image\/jpeg|png/.test(obj.file.type) || obj.file.size > 5242880)
	) {
		errors.file = 'Sólo imágenes .png y .jpeg, menores a 5.24 MB.';
		return errors;
	}

	return errors;
}

export function FormDog(props) {
	const [errors, setErrors] = React.useState({});
	const [state, setState] = React.useState(false);
	const [input, setInput] = React.useState({
		name: '',
		height: '',
		weight: '',
		life_span: '',
		temperament: '',
		image: '',
		file: '',
	});

	useEffect(() => {
		props.getDogsCreated();
	}, [input.name]); // eslint-disable-line react-hooks/exhaustive-deps

	function submiting(e) {
		e.preventDefault();
		let formData = new FormData();
		formData.append('image', input.image);
		formData.append(
			'info',
			JSON.stringify({
				name: input.name,
				height: input.height,
				weight: input.weight,
				life_span: input.life_span,
				temperament: input.temperament,
			})
		);
		props.addBredd(formData);
		setState(true);
		setter(input);
		document.getElementById('input-file').value = '';
	}

	function handleInputChange(e) {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
		setErrors(
			validate(
				{
					...input,
					[e.target.name]: e.target.value,
				},
				props.dogsCreated
			)
		);
	}

	function handleInputFile(e) {
		if (e.target.files[0]) {
			setInput({
				...input,
				image: e.target.files[0],
				file: {
					size: e.target.files[0].size,
					type: e.target.files[0].type,
				},
			});
			setErrors(
				validate(
					{
						...input,
						file: {
							size: e.target.files[0].size,
							type: e.target.files[0].type,
						},
					},
					props.dogsCreated
				)
			);
		} else {
			setInput({
				...input,
				image: '',
				file: {},
			});
		}
	}

	return (
		<div id='global-form-container'>
			<form
				id='addBreed-form'
				onSubmit={submiting}
				encType='multipart/form-data'
			>
				<h2>Añade una nueva raza</h2>
				<div class='inputElement'>
					<label class='labelElement'>Nombre de la raza:</label>
					<input
						className={errors.name ? 'danger' : 'success'}
						type='text'
						name='name'
						onChange={(e) => handleInputChange(e)}
						value={input.name}
					/>
				</div>
				{errors.name && <p className='danger'>{errors.name}</p>}
				<div class='inputElement'>
					<label class='labelElement'>Peso (kg):</label>
					<input
						className={errors.weight ? 'danger' : 'success'}
						type='text'
						name='weight'
						value={input.weight}
						onChange={(e) => handleInputChange(e)}
					/>
				</div>
				{errors.weight && <p className='danger'>{errors.weight}</p>}
				<div class='inputElement'>
					<label class='labelElement'>Altura (m):</label>
					<input
						className={errors.height ? 'danger' : 'success'}
						type='text'
						name='height'
						value={input.height}
						onChange={(e) => handleInputChange(e)}
					/>
				</div>
				{errors.height && <p className='danger'>{errors.height}</p>}
				<div className='inputElement'>
					<label className='labelElement'>Esperanza de vida:</label>
					<input
						className='success'
						type='text'
						name='life_span'
						value={input.life_span}
						onChange={(e) => handleInputChange(e)}
					/>
				</div>
				<div class='inputElement'>
					<label class='labelElement'>Temperamento/s:</label>
					<input
						className={errors.temperament ? 'danger' : 'success'}
						type='text'
						name='temperament'
						value={input.temperament}
						onChange={(e) => handleInputChange(e)}
					/>
				</div>
				{errors.temperament && <p className='danger'>{errors.temperament}</p>}
				<div class='inputElement'>
					<div id='input-file-container'>
						<label for='input-file' className='labelFile'>
							<input
								id='input-file'
								type='file'
								name='image'
								onChange={(e) => handleInputFile(e)}
							/>
							<FcAddImage />
						</label>
					</div>
					<input
						id='btn-form-dog'
						className='btn-submit'
						type='submit'
						text='enviar'
						disabled={
							errors.name ||
							errors.weight ||
							errors.height ||
							errors.temperament ||
							errors.image ||
							input.name === '' ||
							input.weight === '' ||
							input.height === ''
								? 'disabled'
								: ''
						}
					/>
				</div>
				{errors.file && <p className='danger'>{errors.file}</p>}
			</form>
			{props.dogDetail && props.dogDetail.name && state ? (
				<div id='form-response-container'>
					<h3>
						¡Woof, woof! Muchas gracias por tu contribución!
						<br />
						Observa tu creación:
					</h3>
					<NavLink
						exact
						to={`/dogs/${props.dogDetail.id}`}
						className='link-created'
					>
						{props.dogDetail.name}
					</NavLink>
				</div>
			) : (
				<div></div>
			)}
			{props.dogDetail && props.dogDetail.error && state ? (
				<div id='form-response-container'>
					<h3>Woof? Algo salió mal. ¡Inténtalo de nuevo!</h3>
				</div>
			) : null}
		</div>
	);
}

function mapStateToProps(state) {
	return {
		dogDetail: state.dogDetail,
		dogsCreated: state.dogsCreated,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addBredd: (data) => dispatch(addBredd(data)),
		getDogsCreated: (filter, filterValue) =>
			dispatch(getDogsCreated(filter, filterValue)),
		getDogDetail: (id) => dispatch(getDogDetail(id)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FormDog);
