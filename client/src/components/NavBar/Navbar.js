import React from 'react';
import './navbar.css';
import {NavLink} from 'react-router-dom';

export default function NavBar() {
	return (
		<header className='navbar'>
			<div id='ww-container'>
				<img
					id='logo-WikiWoof'
					src={
						'https://res.cloudinary.com/c0a0a/image/upload/v1627139808/Wiki-woof/logoWWpng_bk8rcl.png'
					}
					width='50'
					height='50'
					className='d-inline-block align-top'
					alt='Logo Wiki Woof.'
				/>
				<span id='spanNav'>Wiki Woof!</span>
			</div>
			<nav>
				<ul className='list'>
					<li className='list-item'>
						<NavLink exact to='/'>
							Inicio
						</NavLink>
						<NavLink to='/dogs'>Razas</NavLink>
						<NavLink to='/creation'>Creación</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}
