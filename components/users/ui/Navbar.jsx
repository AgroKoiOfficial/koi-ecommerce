import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const Navbar = ({ isNavbar, toggleSidebar, title }) => {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [clientTheme, setClientTheme] = useState(theme);

  useEffect(() => {
    setClientTheme(theme);
  }, [theme]);

  const isDarkMode = clientTheme === 'dark';

  return (
    <nav
      className={` fixed top-0 left-0 z-30 w-full border-b px-6 py-4 transition-colors duration-200 ease-in-out`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="focus:outline-none lg:hidden"
            onClick={toggleSidebar}
          >
            <svg
              className={`h-6 w-6 `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              ></path>
            </svg>
          </button>

          <div className="ml-3 lg:pl-64">
            <div className={`text-lg font-semibold `}>{title}</div>
          </div>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`focus:outline-none `}
                aria-label="Buka menu pengguna"
              >
                <svg
                  className={`h-6 w-6 `}
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-32 mt-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
              }`}
            >
              {status === "loading" ? (
                <DropdownMenuItem className="p-2 text-center">
                  Loading...
                </DropdownMenuItem>
              ) : session && session.user ? (
                <>
                  <DropdownMenuItem className="p-2 text-center">
                    Hi, {session.user.name}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="p-2 text-center">
                  Not logged in
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
