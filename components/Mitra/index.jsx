import React, { useEffect, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import styles from './Mitra.module.scss'; // Import the SCSS module

const Mitra = () => {
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

  const images = [
    '/Clearesta-logo.webp',
    '/gunung harta logo.webp',
    '/hj-logo.webp',
    '/kalog-logo.webp',
    '/ki8-logo.webp',
    '/kib-logo.webp',
    '/pesawat-logo.webp'
  ];

  return (
    <div className="embla mt-4 lg:mt-8 relative" ref={emblaRef} aria-roledescription="carousel">
      <div className={styles.embla__container}>
        {images.map((src, index) => (
          <div className={styles.embla__slide} key={index}>
            <div className="relative">
              <Image
                src={src}
                alt={`Mitra ${index + 1}`}
                width={1920}
                height={1080}
                priority
                loading="eager"
                className="w-full object-cover"
                style={{
                  width: "auto",
                  maxWidth: "auto",
                  minHeight: "12vh",
                  maxHeight: "12vh",
                  margin: "0 auto",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mitra;
