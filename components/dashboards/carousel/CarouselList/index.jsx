import React from 'react';

export default function CarouselList({ carousels, updateCarousel, deleteCarousel }) {
  return (
    <div className="w-1/2 pl-8">
      {carousels.map(carousel => (
        <div key={carousel.id} className="mb-8 p-4 border rounded shadow-md">
          <input
            type="text"
            value={carousel.title || ''}
            onChange={e => {
              const updatedCarousel = { ...carousel, title: e.target.value };
              updateCarousel(updatedCarousel);
            }}
            placeholder="Title"
            className="border p-2 mb-4 w-full"
          />
          <input
            type="color"
            value={carousel.color || '#ffffff'}
            onChange={e => {
              const updatedCarousel = { ...carousel, color: e.target.value };
              updateCarousel(updatedCarousel);
            }}
            className="border p-2 mb-4 w-full"
          />
          <button
            onClick={() => deleteCarousel(carousel.id)}
            className="bg-red-500 text-white py-2 px-4 rounded w-full"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
