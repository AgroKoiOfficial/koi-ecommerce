import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import PreviewCarousel from "@/components/dashboards/carousel/PreviewCarousel";
import AddCarouselForm from "@/components/dashboards/carousel/AddCarouselForm";
import CarouselList from "@/components/dashboards/carousel/CarouselList";

const AdminCarousel = () => {
  const [carousels, setCarousels] = useState([]);
  const [titleInput, setTitleInput] = useState("");

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await fetch("/api/carousel");
        if (!response.ok) {
          throw new Error("Failed to fetch carousels");
        }
        const data = await response.json();
        setCarousels(data);
      } catch (error) {
        console.error("Error fetching carousels:", error);
      }
    };

    fetchCarousels();
  }, []);

  const handleAddCarousel = async (formData) => {
    try {
      const session = await getSession();
      const response = await fetch("/api/carousel/add/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add carousel");
      }

      const newCarousel = await response.json();
      setCarousels([...carousels, newCarousel]);
      setTitleInput("");
    } catch (error) {
      console.error("Error adding carousel:", error);
    }
  };

  const handleDeleteCarousel = async (carouselId) => {
    try {
      const session = await getSession();
      const response = await fetch(`/api/carousel/delete/${carouselId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete carousel");
      }

      setCarousels(carousels.filter((carousel) => carousel.id !== carouselId));
    } catch (error) {
      console.error("Error deleting carousel:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Carousels Preview</h1>
      <PreviewCarousel carousels={carousels} />
      <AddCarouselForm onAddCarousel={handleAddCarousel} />
      <CarouselList carousels={carousels} onDeleteCarousel={handleDeleteCarousel} />
    </div>
  );
};

export default AdminCarousel;
