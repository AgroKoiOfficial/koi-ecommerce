import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export const CTA = () => {
  const [showCTA, setShowCTA] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/cta/getByDevice");
        const result = await response.json();
        if (result.active) {
          setName(result.name);
          setPhoneNumber(result.phoneNumber);
          setMessage(result.message);
          setShowCTA(true);
        }
      } catch (error) {
        console.error("Error fetching CTA data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const navbarHeight = 64;
      const showScrollThreshold = navbarHeight + 100;

      if (scrollY > showScrollThreshold) {
        setShowCTA(true);
      } else {
        setShowCTA(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${showCTA ? 'opacity-100' : 'opacity-0'}`}>
      {showCTA && (
        <a
          href={`https://wa.me/${phoneNumber}?text=Hallo admin, ${name}? ${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 lg:py-4 px-2 lg:px-4 rounded-full shadow-lg flex items-center"
          style={{ width: "fit-content" }}
          aria-label={`Hubungi kami melalui WhatsApp ${name}`}
        >
          <FaWhatsapp className="cta-icon w-8 lg:w-8 h-8 lg:h-8" alt="WhatsApp Icon" />
        </a>
      )}
    </div>
  );
};
