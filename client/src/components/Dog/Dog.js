import React, {useEffect} from 'react';
import './dog.css';
import {connect} from 'react-redux';
import {getDogDetail} from '../../actions/index';
import {NavLink} from 'react-router-dom';

export function Dog(props) {
	useEffect(() => {
		const dogId = props.match && props.match.params.id;
		dogId && props.getDogDetail(dogId);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	return (
		<div id={props.detail ? 'global-dog-container' : ''}>
			<div
				key={
					props.dog ? props.dog.id + 'div' : props.dogDetail.id + 'div' + 'div'
				}
				className={props.dog ? 'dog-container' : 'dog-container dog-detail'}
			>
				{props.detail && <h2>{props.dogDetail.name}</h2>}
				{props.dog.image_url && (
					<img
						key={'image' + props.dog.id || 'image' + props.dogDetail.id}
						src={props.dog.image_url || props.dogDetail.image_url}
						className={props.dog ? 'img-home' : 'img-dog-detail'}
						alt={props.dog.name || props.dogDetail.name}
					/>
				)}
				{props.home && (
					<NavLink
						exact
						to={`/dogs/${props.dog.id}`}
						className='link-dog-detail'
					>
						{props.dog.name}
					</NavLink>
				)}

				{props.detail && (
					<div>
						<span key={'weight' + props.dogDetail.weight}>
							{' '}
							<b>Peso:</b> {props.dogDetail.weight} kg.
						</span>
						<span key={'height' + props.dogDetail.height}>
							<b>Altura:</b> {props.dogDetail.height} m.
						</span>
						<span key={'life_span' + props.dogDetail.life_span}>
							<b>Esperanza de vida:</b> {props.dogDetail.life_span}.
						</span>
					</div>
				)}
				{props.dog && props.dog.temperament ? (
					<span key={'temperament' + props.dog.temperament}>
						{props.dog.temperament}.
					</span>
				) : props.dogDetail && props.dogDetail.temperament ? (
					<span key={'temperament' + props.dogDetail.temperament}>
						<b>Temperamento:</b> {props.dogDetail.temperament}.
					</span>
				) : (
					<span>
						Woof? Puedes agregar mi
						<NavLink
							key={props.dog ? props.dog.id : props.dogDetail.id}
							exact
							to={`/temperament/`}
							className='link-dog-detail'
						>
							{' temperamento'}
						</NavLink>
						?
					</span>
				)}
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		dogDetail: state.dogDetail,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getDogDetail: (id) => dispatch(getDogDetail(id)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Dog);
