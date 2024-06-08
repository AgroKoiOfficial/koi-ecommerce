import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full relative -bottom-96 bg-gradient-to-r from-blue-900 to-red-700 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
        <div className="flex items-center mb-4 lg:mb-0 lg:items-start">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-16 lg:w-20 w-16 lg:h-20 mr-4 lg:mr-2 mb-2 lg:mt-8"
          />
          <span className="text-lg lg:text-xl font-bold lg:mt-12">
            Jual Ikan Koi
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:text-lg">
          <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
            <li>
              <a href="/" className="text-gray-300 hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="text-gray-300 hover:text-white">
                Products
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-300 hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-300 hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="text-gray-300 hover:text-white">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div className="flex mt-4 lg:mt-0">
          <a href="#" className="text-gray-300 hover:text-white mr-4">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white mr-4">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
      <div className="mt-6 text-gray-400 text-sm text-center">
        <p className="mb-2 text-white">
          &copy; {new Date().getFullYear()} Jual Ikan Koi. All rights reserved.
        </p>
        <p className="mb-2 text-white">Designed with ❤️ by Agro Koi</p>
      </div>
    </footer>
  );
};

export default Footer;
