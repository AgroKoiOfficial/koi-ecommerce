import React from "react";
import { Button } from "../ui/Button";
import { useTheme } from "next-themes";
import { getSession } from "next-auth/react";

const Navbar = ({ isNavbar, toggleSidebar, handleLogout, title }) => {
  const { data: session } = getSession();
  const { resolvedTheme } = useTheme();

  const navbarClasses = isNavbar
    ? resolvedTheme === "dark"
      ? "bg-gray-900 shadow-md"
      : "bg-white shadow-md"
    : "bg-transparent";

  const borderClasses = resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200";
  const textColor = resolvedTheme === "dark" ? "text-white" : "text-gray-800";
  const buttonTextColor = resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900";

  return (
    <nav
      className={`${navbarClasses} ${borderClasses} fixed top-0 left-0 z-30 w-full px-6 py-4 transition-colors duration-200 ease-in-out border-b`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button
            className={`${buttonTextColor} focus:outline-none lg:hidden`}
            onClick={toggleSidebar}>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>

          <div className="ml-3 lg:pl-64">
            <div className={`text-lg font-semibold ${textColor}`}>{title}</div>
          </div>
        </div>

        <div className="flex items-center">
          {session ? (
            <div className={`${textColor} mr-4`}>{session.user?.name}</div>
          ) : null}
          <Button
            onClick={handleLogout}
            className="focus:outline-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
