import React, { useEffect, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

const Carousel = ({ carousels }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const autoplayInterval = useRef(null);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayInterval.current = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext();
      }
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current);
    }
  };

  useEffect(() => {
    if (emblaApi) {
      startAutoplay();
      emblaApi.on("select", startAutoplay);
      emblaApi.on("pointerDown", stopAutoplay);
    }

    return () => {
      stopAutoplay();
    };
  }, [emblaApi]);

  return (
    <div className="embla mt-4 lg:mt-8" ref={emblaRef} aria-roledescription="carousel">
      <div className="embla__container">
        {Array.isArray(carousels) && carousels.length > 0 ? (
          carousels.map((carousel, index) => (
            <div
              className="embla__slide"
              key={carousel.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${carousels.length}`}
            >
              <div className="relative">
                <Image
                  src={carousel.image}
                  alt={carousel.title || "Carousel Image"}
                  width={1920}
                  height={1080}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full lg:w-2/3 object-cover mb-2"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    margin: "0 auto",
                  }}
                />
                <h2
                  className="text-lg font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    color: carousel.color,
                    padding: "10px",
                  }}
                >
                  {carousel.title}
                </h2>
              </div>
            </div>
          ))
        ) : (
          <div className="embla__slide">
            <p className="text-lg font-bold text-center">Carousel not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
