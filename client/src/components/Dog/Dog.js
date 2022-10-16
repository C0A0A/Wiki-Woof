import React, {useEffect} from 'react';
import './dog.css';
import {useSelector, useDispatch} from 'react-redux';
import {getDogDetail} from '../../actions/index';
import {NavLink} from 'react-router-dom';
import {v4 as idGenerator} from 'uuid';

export function Dog(props) {
	const dogDetail = useSelector((state) => state.dogDetail);
	const dispatch = useDispatch();

	useEffect(() => {
		const dogId = props.match && props.match.params.id;
		dogId && dispatch(getDogDetail(dogId));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	return (
		<div
			className={
				props.home ? 'global-dog-container' : 'global-detail-container'
			}
		>
			<div
				key={idGenerator()}
				className={props.home ? 'dog-container' : 'dog-detail'}
			>
				{!props.home && <h2 className='title'>{dogDetail.name}</h2>}

				<img
					key={idGenerator()}
					src={props.home ? props.dog.image_url : dogDetail.image_url}
					className={props.home ? 'img-home' : 'img-dog-detail'}
					alt={props.home ? props.dog.name : dogDetail.name}
				/>

				{props.home && (
					<NavLink
						exact
						to={`/dogs/${props.dog.id}`}
						className='link-dog-detail'
					>
						{props.dog.name}
					</NavLink>
				)}

				{!props.home && (
					<div className='info-container'>
						<span key={idGenerator()}>
							{' '}
							<b>Peso:</b> {dogDetail.weight} kg.
						</span>
						<span key={idGenerator()}>
							<b>Altura:</b> {dogDetail.height} cm.
						</span>
						<span key={idGenerator()}>
							<b>Esperanza de vida:</b> {dogDetail.life_span}.
						</span>
					</div>
				)}
				{props.dog && props.dog.temperament ? (
					<span key={idGenerator()}>{props.dog.temperament}.</span>
				) : dogDetail && dogDetail.temperament ? (
					<span key={idGenerator()}>
						<b>Temperamento:</b> {dogDetail.temperament}.
					</span>
				) : null}
			</div>
		</div>
	);
}

export default Dog;
