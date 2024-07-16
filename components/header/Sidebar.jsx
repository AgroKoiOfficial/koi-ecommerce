import React from "react";
import MenuLinks from "./MenuLinks";
import { useTheme } from "next-themes";
import styles from "./Navbar.module.scss";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { theme } = useTheme();

  const sidebarStyles = theme === 'dark' ? styles.darkSidebar : styles.lightSidebar;

  return (
    isSidebarOpen && (
      <div className="lg:hidden top-0 left-0">
        <div className={`fixed left-0 top-0 h-screen w-3/4 z-10 p-4 ${sidebarStyles}`}>
          <MenuLinks className="flex flex-col space-y-4" itemClassName="rounded-md p-2" toggleSidebar={toggleSidebar} />
        </div>
      </div>
    )
  );
};

export default Sidebar;
