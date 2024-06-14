import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export const CTA = () => {
  const [showCTA, setShowCTA] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/cta/getByDevice");
        const result = await response.json();
        console.log("CTA data:", result);
        setData(result);
        setShowCTA(result.active);
      } catch (error) {
        console.error("Error fetching CTA data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fixed bottom-0 right-0 m-4">
      {showCTA && (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaWhatsapp className="cta-icon w-8 h-8 text-green-500 mr-2" />
            <span className="text-gray-800">
              Halo {data?.name}, apakah ada yang bisa dibantu?
            </span>
          </div>
          {data?.message && (
          
          <a
            href={`https://wa.me/+${data?.phoneNumber}?text=${data?.message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mt-2 rounded-md text-center">
            Hubungi
          </a>
          )}
        </div>
      )}
    </div>
  );
};
