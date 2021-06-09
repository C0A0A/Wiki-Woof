import React from 'react';
import './landing.css';
import {NavLink} from 'react-router-dom';
import Slider from '../Slider/Slider.js';

export default function Landing() {
	return (
		<div className='landing-container'>
			<h1 id='landing-title'>Woof woof! Bienvenidos!</h1>
			<Slider />

			<div id='sub'>
				<p id='landing-text'>
					Wiki Woof es una comunidad dedicada a ellos, los amigos más nobles que
					podemos tener. Aquí, tratamos de reunir toda la información posible
					sobre las distintas razas, temperamentos y demás características que
					hacen a estos seres únicos y maravillosos, capaces de llenarnos de
					felicidad y brindarnos todo su amor en cualquier circunstancia.{' '}
				</p>
				<NavLink exact to={`/dogs/`} id='link-home' className='link-dog-detail'>
					{'¡Choca esa pata!'}
				</NavLink>
			</div>
		</div>
	);
}
