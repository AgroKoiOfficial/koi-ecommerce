import React, { useState, useEffect } from "react";
import { GrServices } from "react-icons/gr";
import { useTheme } from "next-themes";

const Services = () => {
  const [services, setServices] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const cardBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardTextClass = theme === "dark" ? "text-white" : "text-gray-800";
  const boxShadowClass = theme === "dark" ? "shadow-gray-800" : "shadow-gray-200";

  return (
    <div className={`${cardBgClass} ${cardTextClass} flex flex-col items-center justify-center mt-4 rounded-lg shadow-md p-4`}>
      <h1 className="text-2xl lg:text-3xl text-center font-bold mb-4 lg:mb-8">
        Mengapa harus Jual Ikan Koi?
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className={`w-full rounded-lg shadow-lg ${boxShadowClass} p-8 ${cardBgClass} ${cardTextClass}`}>
            <div className="flex items-center justify-center mb-4">
              <GrServices className="text-xl lg:text-2xl" />
            </div>
            <h2 className="text-xl text-center font-bold mb-2 lg:mb-4">{service.title}</h2>
            <p className="font-semibold">{service.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
