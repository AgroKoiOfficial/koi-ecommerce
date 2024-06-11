import React, { useRef, useState } from "react";
import { MdPlayArrow, MdPause, MdReplay } from "react-icons/md";

const ProductMedia = ({ product }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReplay = () => {
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setIsPaused(false);
  };

  return (
    <div className="lg:w-1/2 lg:mx-auto lg:text-center">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-auto h-96 object-contain mb-4 mx-auto shadow-lg"
        />
      )}
      {product.video && (
        <div className="relative mt-4 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            src={product.video}
            controls={false}
            autoPlay={false}
            loop={false}
            muted
            className="w-full h-auto transition-transform transform hover:scale-105"
            style={{ backgroundColor: "#000" }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPaused(true)}>
            Your browser does not support the video tag.
          </video>
          {isPlaying && !isPaused && (
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-none focus:outline-none"
              onClick={handlePlayPause}
              aria-label="Pause Video">
              <MdPause className="h-16 w-16 text-white opacity-75 hover:opacity-100 transition-opacity duration-300" />
            </button>
          )}
          {!isPlaying && !isPaused && (
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-none focus:outline-none"
              onClick={handlePlayPause}
              aria-label="Play Video">
              <MdPlayArrow className="h-16 w-16 text-white opacity-75 hover:opacity-100 transition-opacity duration-300" />
            </button>
          )}
          {isPaused && (
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-none focus:outline-none"
              onClick={handleReplay}
              aria-label="Replay Video">
              <MdReplay className="h-16 w-16 text-white opacity-75 hover:opacity-100 transition-opacity duration-300" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductMedia;
