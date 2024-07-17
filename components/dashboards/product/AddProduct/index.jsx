import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { getSession } from "next-auth/react";
import slug from "slug";
import { useTheme } from 'next-themes';

export const AddProduct = ({ onClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories?page=${page}&limit=10`);
        const data = await res.json();
        const totalCount = res.headers.get("X-Total-Count");
        setCategories((prevCategories) => [...prevCategories, ...data]);
        setTotalPages(Math.ceil(totalCount / 10));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, [page]);

  const generateSlug = (productName) => {
    return slug(productName, { lower: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("slug", generateSlug(name));
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    if (!session || !session.user.isAdmin) {
      setError("You are not authorized to perform this action");
      return;
    }

    try {
      const res = await fetch("/api/products/add", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const product = await res.json();
        setSuccess("Product created successfully!");
        setName("");
        setPrice("");
        setStock("");
        setDescription("");
        setCategoryId("");
        setImage(null);
        setVideo(null);
        onClose();
      } else {
        const errorData = await res.json();
        setError("Failed to create product: " + errorData.error);
      }
    } catch (error) {
      console.error("Failed to create product", error);
      setError("Failed to create product");
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "nextPage") {
      setPage((prev) => Math.min(prev + 1, totalPages));
    } else if (value === "prevPage") {
      setPage((prev) => Math.max(prev - 1, 1));
    } else {
      setCategoryId(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl mx-auto">
        <div className={`relative flex flex-col w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-lg outline-none focus:outline-none`}>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Slug
                  </label>
                  <Input
                    type="text"
                    value={generateSlug(name)}
                    readOnly
                    className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Stock
                  </label>
                  <Input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Category
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={categoryId}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    {page < totalPages && (
                      <option value="nextPage">Load more...</option>
                    )}
                    {page > 1 && (
                      <option value="prevPage">Load previous...</option>
                    )}
                  </select>
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Video
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Product
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                >
                  Cancel
                </Button>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {success && <p className="text-green-500 mt-2">{success}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
