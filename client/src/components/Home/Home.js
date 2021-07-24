import React, {useEffect} from 'react';
import './home.css';
import Search from '../Search/Search.js';
import {useSelector, useDispatch} from 'react-redux';
import {searchDogs} from '../../actions/index.js';
import Dog from '../Dog/Dog.js';
import {v4 as idGenerator} from 'uuid';

export function Home() {
	const filterDogs = useSelector((state) => state.filterDogs);
	const dispatch = useDispatch();

	useEffect(() => {
		!filterDogs.dogs && dispatch(searchDogs());
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div id='tools-container'>
				<Search />
			</div>
			<div id='dogs-container'>
				{filterDogs.dogs &&
					filterDogs.dogs.map((dog, i) => (
						<Dog key={idGenerator()} dog={dog} home={true} />
					))}
			</div>
		</div>
	);
}

export default Home;
