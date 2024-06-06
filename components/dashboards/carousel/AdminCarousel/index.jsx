import { useState } from 'react';

const AdminCarousel = ({ action, carousel, onSubmit }) => {
  const [title, setTitle] = useState(carousel ? carousel.title : '');
  const [color, setColor] = useState(carousel ? carousel.color : '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(carousel ? carousel.image : null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (title) formData.append('title', title);
    if (color) formData.append('color', color);
    if (image) formData.append('image', image);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 w-full mb-4" />
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 w-full mb-4" />
      <div className="mb-4">
        <input type="file" onChange={handleImageChange} className="hidden" id="file-input" />
        <label htmlFor="file-input" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer">Choose Image</label>
        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-20" />}
      </div>
      <button type="submit" className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2 ${action === 'add' ? 'hidden' : ''}`}>Update</button>
      <button type="submit" className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2 ${action === 'update' ? 'hidden' : ''}`}>Add</button>
    </form>
  );
};

export default AdminCarousel;
