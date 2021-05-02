import React from "react";
import "./Slider.css";

export default function Slider () {
    let imagesToSlide = ["https://storage.googleapis.com/dogs-web-app/slide1.png", "https://storage.googleapis.com/dogs-web-app/slide2.png", "https://storage.googleapis.com/dogs-web-app/slide3.png", "https://storage.googleapis.com/dogs-web-app/slide4.png", "https://storage.googleapis.com/dogs-web-app/slide5.png","https://storage.googleapis.com/dogs-web-app/slide6.png"];
    //const [x, setX] = useState(0);

   /*  const slideToLeft = () => {
        x === 0 ? setX(-100*(imagesToSlide.length-1)) : setX(x + 100)
    }
    const slideToRight = () => {
        x === -100*(imagesToSlide.length-1) ? setX(0) : setX(x - 100)
    } */
    //style={{transform:`translateX(${x}%)`}}
    return (
        <div className="slider-container">
            {
                imagesToSlide.map((image, i) => {
                    return (
                        <div key={i + "-slide"} className="slide">
                        <img key={i + "-image"} src={image} className="img-slide" alt="Happy dogs playing."/>
                        </div>
                    )
                })
            }
            {/* <button id="button-left" className="button-nav" onClick={slideToLeft}>L</button>
            <button id="button-right" className="button-nav"onClick={slideToRight}>R</button> */}
        </div>
    )

}

