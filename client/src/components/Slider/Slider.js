import React from 'react';
import './Slider.css';

export default function Slider() {
	let imagesToSlide = [
		'https://res.cloudinary.com/c0a0a/image/upload/v1627158918/Wiki-woof/Slider1_kk0spd.png',
		'https://res.cloudinary.com/c0a0a/image/upload/v1627158911/Wiki-woof/Slider2_mfal4i.png',
		'https://res.cloudinary.com/c0a0a/image/upload/v1627158923/Wiki-woof/Slider3_admvxc.png',
		'https://res.cloudinary.com/c0a0a/image/upload/v1627158916/Wiki-woof/Slider4_aqvdkq.png',
		'https://res.cloudinary.com/c0a0a/image/upload/v1627158926/Wiki-woof/Slider5_i2clce.png',
		'https://res.cloudinary.com/c0a0a/image/upload/v1627158922/Wiki-woof/Slider6_zbrumz.png',
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
