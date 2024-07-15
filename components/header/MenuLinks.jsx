import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const MenuLinks = ({ className, itemClassName,  toggleSidebar }) => {
  const router = useRouter();

  const handleLinkClick = () => {
    if (toggleSidebar) toggleSidebar();
  };

  return (
    <div className={`flex flex-col justify-center mt-8 lg:mt-0 space-y-12 lg:space-y-0 items-center md:flex-row ${className}`}>
      <Link href="/" passHref onClick={handleLinkClick}>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/" ? "text-red-500 font-bold" : ""
          }`}>
          Beranda
        </span>
      </Link>
      <Link href="/products" passHref onClick={handleLinkClick}>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/products" ? "text-red-500 font-bold" : ""
          }`}>
          Produk
        </span>
      </Link>
      <Link href="/categories" passHref onClick={handleLinkClick}>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/categories" ? "text-red-500 font-bold" : ""
          }`}>
          Kategori
        </span>
      </Link>
      <Link href="/abouts" passHref onClick={handleLinkClick}>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/abouts" ? "text-red-500 font-bold" : ""
          }`}>
          Tentang Kami
        </span>
      </Link>
      <Link href="/faqs" passHref onClick={handleLinkClick}>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/faqs" ? "text-red-500 font-bold" : ""
          }`}>
          FAQs
        </span>
      </Link>
    </div>
  );
};

export default MenuLinks;
