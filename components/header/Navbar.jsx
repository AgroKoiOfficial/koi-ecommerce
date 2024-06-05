import React from "react";
import { FiMenu, FiX, FiUser, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
import MenuLinks from "./MenuLinks";
import { useNavbar } from "./useNavbar";
import Sidebar from "./Sidebar"; 

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

  return (
    <nav
      className={`fixed w-full z-10 bg-white shadow-md ${
        isNavbar ? "border-b" : ""
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-12 lg:h-16 w-12 lg:w-16" src="/logo.png" alt="logo koi" />
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
                className="text-gray-600 hover:text-gray-700">
                <FiShoppingCart size={24} />
              </Link>
            </div>
            {session && session.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="text-gray-600 hover:text-gray-700 focus:outline-none"
                  onClick={toggleDropdown}>
                  <FiUser size={24} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <a
                      href={session.user.isAdmin ? "/dashboard" : "/user"}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      {session.user.isAdmin ? "Dashboard" : "User"}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="text-gray-600 hover:text-gray-700 focus:outline-none"
                onClick={() => router.push("/login")}>
                Login
              </button>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleSidebar}
              className="bg-white text-gray-900 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
              {isSidebarOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      <Sidebar isSidebarOpen={isSidebarOpen} />
    </nav>
  );
};

export default Navbar;
