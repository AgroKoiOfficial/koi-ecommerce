import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 to-red-700 text-white py-8">
      <div className="container mx-auto px-4 flex lg:flex-row justify-between items-center">
        <div className="flex flex-col lg:flex-row items-center mb-4 lg:mb-0 lg:items-start">
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

        <div className="flex flex-col">
          <nav
            aria-label="Footer Navigation"
            className="flex flex-col lg:flex-row items-center lg:text-lg">
            <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/abouts" className="text-gray-300 hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-300 hover:text-white">
                  FAQS
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Syarat & Layanan
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="mt-6 text-gray-400 text-sm text-center">
        <address className="flex items-center justify-center mt-4 lg:mt-0 mb-4 lg:mb-8 space-x-4">
          <Link
            href="https://www.facebook.com/agrokoifarms/"
            className="text-gray-300 hover:text-white"
            aria-label="Facebook">
            <FaFacebook size={24} />
          </Link>
          <Link
            href="https://www.tiktok.com/@agrokoifarm?is_from_webapp=1&sender_device=pc"
            className="text-gray-300 hover:text-white"
            aria-label="Twitter">
            <FaTiktok size={24} />
          </Link>
          <Link
            href="https://www.instagram.com/agrokoi_official/"
            className="text-gray-300 hover:text-white"
            aria-label="Instagram">
            <FaInstagram size={24} />
          </Link>
          <Link
            href="https://youtube.com/@agrokoifarm?si=p9wYKokFTBX9xnKE"
            className="text-gray-300 hover:text-white"
            aria-label="Instagram">
            <FaYoutube size={24} />
          </Link>
        </address>
        <p className="mb-2 text-white">
          &copy; {new Date().getFullYear()} Jual Ikan Koi. All rights reserved.
        </p>
        <p className="mb-2 text-white">Designed with ❤️ by Agro Koi</p>
      </div>
    </footer>
  );
};

export default Footer;
