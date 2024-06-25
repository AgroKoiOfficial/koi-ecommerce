import React from "react";
import useEmblaCarousel from "embla-carousel-react";

const PreviewCarousel = ({ carousels }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true });
  return (
  <div className="embla" ref={emblaRef}>
    <div className="embla__container">
      {carousels.length > 0 ? (
        carousels.map((carousel) => (
          <div className="embla__slide" key={carousel.id}>
            <div className="relative">
              <img
                src={carousel.image}
                alt={carousel.title}
                className="w-full lg:w-3/4 object-cover mb-2"
                style={{ maxWidth: "100%", margin: "0 auto" }}
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
)};

export default PreviewCarousel;
