import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

const MenuLinks = ({ className, itemClassName, toggleSidebar }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const textStyles = theme === 'dark' ? 'text-white hover:text-gray-400' : 'text-gray-800 hover:text-red-500';

  const handleLinkClick = () => {
    if (toggleSidebar) toggleSidebar();
  };

  return (
    <div className={`flex flex-col justify-center mt-8 lg:mt-0 space-y-12 lg:space-y-0 items-center md:flex-row ${className}`}>
      <Link href="/" passHref onClick={handleLinkClick}>
        <span
          className={`${textStyles} ${itemClassName} ${
            router.pathname === "/" ? "font-bold" : ""
          }`}>
          Beranda
        </span>
      </Link>
      <Link href="/products" passHref onClick={handleLinkClick}>
        <span
          className={`${textStyles} ${itemClassName} ${
            router.pathname === "/products" ? "font-bold" : ""
          }`}>
          Produk
        </span>
      </Link>
      <Link href="/categories" passHref onClick={handleLinkClick}>
        <span
          className={`${textStyles} ${itemClassName} ${
            router.pathname === "/categories" ? "font-bold" : ""
          }`}>
          Kategori
        </span>
      </Link>
      <Link href="/about" passHref onClick={handleLinkClick}>
        <span
          className={`${textStyles} ${itemClassName} ${
            router.pathname === "/about" ? "font-bold" : ""
          }`}>
          Tentang Kami
        </span>
      </Link>
      <Link href="/contact" passHref onClick={handleLinkClick}>
        <span
          className={`${textStyles} ${itemClassName} ${
            router.pathname === "/contact" ? "font-bold" : ""
          }`}>
          Hubungi Kami
        </span>
      </Link>
    </div>
  );
};

export default MenuLinks;
