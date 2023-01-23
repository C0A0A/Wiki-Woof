import React, {useState} from 'react';
import './navbar.css';
import {NavLink} from 'react-router-dom';

export default function NavBar() {
	const [Menu, setMenu] = useState([]);

	function menuSetter() {
		if (Menu.length) {
			setMenu([]);
		} else {
			setMenu([
				{name: 'Inicio', path: '/'},
				{name: 'Razas', path: '/dogs'},
				{name: 'Creación', path: '/creation'},
			]);
		}
	}

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
				<span id='spanNav'>Wiki Woof</span>
			</div>
			<nav className='menu-nav'>
				<div className='menu-icon' onClick={menuSetter}>
					<img
						id='menu-img'
						src={
							'https://res.cloudinary.com/c0a0a/image/upload/v1666056845/Wiki-woof/menu_n3dw4h.png'
						}
						alt='Menu Wiki Woof.'
					/>
					<div className='menu-list'>
						{Menu && Menu.length
							? Menu.map((item, idx) => (
									<NavLink id={'lkn-' + idx} exact to={item.path}>
										{item.name}
									</NavLink>
							  ))
							: null}
					</div>
				</div>
			</nav>
		</header>
	);
}
