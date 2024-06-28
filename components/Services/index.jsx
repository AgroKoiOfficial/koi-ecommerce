import React, { useState, useEffect } from "react";
import { GrServices } from "react-icons/gr";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch("/api/services");
      const data = await response.json();
      setServices(data);
    };

    fetchServices();
  }, []);

  return (
    <div className="bg-white flex flex-col items-center justify-center mt-4 rounded-lg shadow-md p-4">
      <h1 className="text-2xl lg:text-3xl text-center font-bold mb-4 lg:mb-8">
        Mengapa harus Koi Toko?
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center mb-4">
              <GrServices className="text-xl lg:text-2xl text-gray-700" />
            </div>
            <h2 className="text-xl text-center font-bold mb-2 lg:mb-4">{service.title}</h2>
            <p className="text-gray-700">{service.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
