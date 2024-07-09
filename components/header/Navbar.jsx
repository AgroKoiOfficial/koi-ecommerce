import React from "react";
import Image from "next/image";
import { FiMenu, FiX, FiUser, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
import MenuLinks from "./MenuLinks";
import { useNavbar } from "../../hooks/useNavbar";
import Sidebar from "./Sidebar";
import { useCart } from "../../hooks/useCart";

const Navbar = () => {
  const router = useRouter();
  const {
    isNavbar,
    session,
    isSidebarOpen,
    isDropdownOpen,
    dropdownRef,
    handleLogout,
    toggleSidebar,
    toggleDropdown,
  } = useNavbar();

  const { cartData } = useCart();
  const cartItemCount = cartData.reduce((total, item) => total + item.quantity, 0);
  return (
    <nav
      className={`fixed w-full z-10 bg-white shadow-md ${
        isNavbar ? "border-b" : ""
      }`} role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                src="/logo.ico"
                alt="Company Logo"
                width={48}
                height={48}
                priority={true}
                style={{ objectFit: "contain", minWidth: "32px", maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center mx-auto">
            <div className="hidden md:block">
              <MenuLinks
                className="ml-10 flex items-baseline space-x-4"
                itemClassName="p-2"
              />
            </div>
          </div>
          <div className="flex items-center ml-auto">
            <div className="flex items-center mr-4">
              <Link
                href={"/cart"}
                className="relative text-gray-600 hover:text-gray-700"
                aria-label="Cart">
                <FiShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
            {session && session.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="text-gray-600 hover:text-gray-700 focus:outline-none"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  aria-label="User menu">
                  <FiUser size={24} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-2 right-4 mt-2 w-48 bg-white border rounded-lg shadow-lg" role="menu">
                    <Link
                      href={session.user.isAdmin ? "/dashboard" : "/user"}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      role="menuitem">
                      {session.user.isAdmin ? "Dashboard" : "User"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      role="menuitem">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="text-gray-600 hover:text-gray-700 focus:outline-none"
                onClick={() => router.push("/login")}
                aria-label="Login">
                Login
              </button>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleSidebar}
              className="bg-white text-gray-900 inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isSidebarOpen}
              aria-label="Menu">
              {isSidebarOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </nav>
  );
};

export default Navbar;
