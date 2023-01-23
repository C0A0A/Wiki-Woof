import React from 'react';
import './landing.css';
import {NavLink} from 'react-router-dom';
import Slider from '../Slider/Slider.js';

export default function Landing() {
	return (
		<div className='landing-container'>
			<div id='slider-sup'>
				<div id='slider-container'>
					<Slider />
				</div>
			</div>
			<div id='sub'>
				<p id='landing-text'>
					Woof Woof! ¡Gracias por visitarnos! 🐾 <br />
					Aquí, podrás ver información sobre las distintas razas y aportar
					contenido. <br />
					Waf! ¿Qué esperas, te animas a encontrar la raza secreta? 🙀
				</p>
				<NavLink exact to={`/dogs/`} id='link-home' className='link-dog-detail'>
					{'¡Choca esa pata!'}
				</NavLink>
			</div>
		</div>
	);
}
