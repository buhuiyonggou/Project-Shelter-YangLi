import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './videoCarousel.css';

function VideoCarousel({ videoIds }) {
    return (
        <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            autoPlay={false}
            className="carousel-container">
            {videoIds.map(videoId => (
                <div key={videoId} className="video-wrapper">
                    <iframe
                        width="200"
                        height="270"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={`video-${videoId}`}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                </div>
            ))}
        </Carousel>
    );
}

export default VideoCarousel;
