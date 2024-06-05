import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const MenuLinks = ({ className, itemClassName }) => {
  const router = useRouter();

  return (
    <div className={`flex flex-col md:flex-row ${className}`}>
      <Link href="/" passHref>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/" ? "text-red-500 font-bold" : ""
          }`}>
          Home
        </span>
      </Link>
      <Link href="/products" passHref>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/products" ? "text-red-500 font-bold" : ""
          }`}>
          Products
        </span>
      </Link>
      <Link href="/categories" passHref>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/categories" ? "text-red-500 font-bold" : ""
          }`}>
          Categories
        </span>
      </Link>
      <Link href="/about" passHref>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/about" ? "text-red-500 font-bold" : ""
          }`}>
          About
        </span>
      </Link>
      <Link href="/contact" passHref>
        <span
          className={`text-gray-800 hover:text-red-500 ${itemClassName} ${
            router.pathname === "/contact" ? "text-red-500 font-bold" : ""
          }`}>
          Contact
        </span>
      </Link>
    </div>
  );
};

export default MenuLinks;
