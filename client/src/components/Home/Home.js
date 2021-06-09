import React, {useEffect} from 'react';
import './home.css';
import Search from '../Search/Search.js';
import {connect} from 'react-redux';
import {searchDogs} from '../../actions/index.js';
import Dog from '../Dog/Dog.js';

export function Home(props) {
	useEffect(() => {
		!props.filterDogs.dogs && props.searchDogs();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div id='tools-container'>
				<Search />
			</div>
			<div id='dogs-container'>
				{props.filterDogs.dogs &&
					props.filterDogs.dogs.map((dog, i) => (
						<Dog key={i + dog} dog={dog} home={true} />
					))}
			</div>
		</div>
	);
}

{
}
function mapStateToProps(state) {
	return {
		filterDogs: state.filterDogs,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		searchDogs: (
			filter,
			filterValue,
			order,
			direction,
			mix,
			standarOffset,
			standarLimit,
			mixOffsetDb,
			mixOffsetApi
		) =>
			dispatch(
				searchDogs(
					filter,
					filterValue,
					order,
					direction,
					mix,
					standarOffset,
					standarLimit,
					mixOffsetDb,
					mixOffsetApi
				)
			),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
