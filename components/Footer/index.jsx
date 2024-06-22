import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 to-red-700 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
        <div className="flex items-center mb-4 lg:mb-0 lg:items-start">
          <Image
            src="/logo.ico"
            alt="Company Logo"
            width={64}
            height={64}
            priority={true}
            style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
          />
          <span className="text-lg lg:text-xl font-bold ml-4 lg:mt-4">
            Jual Ikan Koi
          </span>
        </div>

        <nav aria-label="Footer Navigation" className="flex flex-col lg:flex-row items-center lg:text-lg">
          <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
            <li>
              <a href="/" className="text-gray-300 hover:text-white">
                Home
              </a>
            </li>
            <li>
              <Link href="/products" className="text-gray-300 hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-300 hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="text-gray-300 hover:text-white">
                FAQS
              </Link>
            </li>
          </ul>
        </nav>

        <address className="flex mt-4 lg:mt-0 space-x-4">
          <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white" aria-label="Twitter">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram">
            <FaInstagram size={24} />
          </a>
        </address>
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
