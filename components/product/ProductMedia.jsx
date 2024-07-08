import React, { useRef, useState } from "react";
import Image from "next/image";
import { MdPlayArrow, MdPause, MdReplay } from "react-icons/md";

const ProductMedia = ({ product }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
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
        <Image
          src={product.image}
          alt={product.name}
          width={100}
          height={100}
          priority={true}
          style={{ objectFit: "contain" }}
          className="h-96 w-full mb-4 mx-auto"
        />
      )}
      {product.video && (
        <div className="relative mt-8 lg:mt-12 rounded-lg overflow-hidden">
          <h2 className="text-xl md:text-xl font-bold mb-2 text-center text-gray-800">Video</h2>
          <div className="relative">
            <div className="absolute inset-0 bg-black opacity-25"></div>
          </div>
          <video
            ref={videoRef}
            src={product.video}
            controls={false}
            autoPlay={false}
            loop={false}
            className="max-w-full mx-auto h-full lg:h-96 transition-transform transform hover:scale-105"
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
