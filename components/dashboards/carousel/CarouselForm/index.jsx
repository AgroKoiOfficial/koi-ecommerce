import React from 'react';

export default function CarouselForm({ preview, handleInputChange, handleSubmit }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    handleInputChange({ target: { value: file } }, 'image');
  };

  return (
    <div className="w-1/2 pr-8">
      <input
        type="text"
        value={preview.title}
        onChange={(e) => handleInputChange(e, 'title')}
        placeholder="Judul"
        className="border p-2 mb-4 w-full"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border p-2 mb-4 w-full"
      />
      <label className="block mb-2">Pilih warna teks:</label>
      <input
        type="color"
        value={preview.color}
        onChange={(e) => handleInputChange(e, 'color')}
        className="appearance-none border-0 h-10 w-full cursor-pointer mb-4 rounded-full overflow-hidden"
        style={{ background: preview.color }}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded w-full"
      >
        Submit
      </button>
    </div>
  );
}
