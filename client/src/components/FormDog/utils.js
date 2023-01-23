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
