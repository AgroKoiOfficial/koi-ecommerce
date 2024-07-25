import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

const Navbar = ({ isNavbar, toggleSidebar, handleLogout, title }) => {
  const { data: session } = useSession();
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState(resolvedTheme);

  useEffect(() => {
    setTheme(resolvedTheme);
  }, [resolvedTheme]);

  const navbarClasses = isNavbar
    ? theme === "dark"
      ? "bg-gray-900 shadow-md"
      : "bg-white shadow-md"
    : "bg-transparent";

  const borderClasses =
    theme === "dark" ? "border-gray-700" : "border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const buttonTextColor = theme === "dark" ? "text-gray-200" : "text-gray-900";

  return (
    <nav
      className={`${navbarClasses} ${borderClasses} fixed top-0 left-0 z-30 w-full px-6 py-4 transition-colors duration-200 ease-in-out border-b`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button
            className={` focus:outline-none lg:hidden`}
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
            <div className={`text-lg font-semibold`}>{title}</div>
          </div>
        </div>

        <div className="flex items-center">
          {session ? (
            <div className={`${textColor} mr-4`}>
              Selamat Datang, {session.user?.name}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
