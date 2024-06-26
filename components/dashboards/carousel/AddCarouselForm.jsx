import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";


const AddCarouselForm = ({ onAddCarousel }) => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [titleInput, setTitleInput] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
       console.log(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitleInput(event.target.value);
  };

  const handleAddClick = () => {
    const formData = new FormData();
    if (fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }
    if (titleInput) {
      formData.append("title", titleInput);
    }
    if (selectedColor) {
      formData.append("color", selectedColor);
    }
    onAddCarousel(formData);
    setTitleInput("");
  };

  return (
    <div className="flex flex-col space-y-4 mt-4">
      <h3 className="text-lg font-bold mb-2">Add Carousel</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
        <Label htmlFor="imageFile">Image</Label>
          <Input
            id="imageFile"
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={titleInput}
            onChange={handleTitleChange}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="colorPicker">Color</Label>
          <input
            id="colorPicker"
            type="color"
            value={selectedColor}
            className="w-[64px] rounded-md "
            onChange={handleColorChange}
          />
        </div>
      </div>
      <Button
        onClick={handleAddClick}
        className="bg-blue-500 hover:bg-blue-700 text-white"
      >
        Add Carousel
      </Button>
    </div>
  );
};

export default AddCarouselForm;
