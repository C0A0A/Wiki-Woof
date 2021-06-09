import React from 'react';
import './Slider.css';

export default function Slider() {
	let imagesToSlide = [
		'https://storage.googleapis.com/dogs-web-app/slide1.png',
		'https://storage.googleapis.com/dogs-web-app/slide2.png',
		'https://storage.googleapis.com/dogs-web-app/slide3.png',
		'https://storage.googleapis.com/dogs-web-app/slide4.png',
		'https://storage.googleapis.com/dogs-web-app/slide5.png',
		'https://storage.googleapis.com/dogs-web-app/slide6.png',
	];

	return (
		<div className='slider-container'>
			{imagesToSlide.map((image, i) => {
				return (
					<div key={i + '-slide'} className='slide'>
						<img
							key={i + '-image'}
							src={image}
							className='img-slide'
							alt='Happy dogs playing.'
						/>
					</div>
				);
			})}
		</div>
	);
}
