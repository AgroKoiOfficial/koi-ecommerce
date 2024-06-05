import React from "react";
import MenuLinks from "./MenuLinks";

const Sidebar = ({ isSidebarOpen }) => {
  return (
    isSidebarOpen && (
      <div className="lg:hidden top-0 left-0">
        <div className="fixed left-0 top-0 h-screen bg-gray-50 w-3/4 z-10 p-4">
          <MenuLinks className="flex flex-col space-y-4" itemClassName="rounded-md p-2" />
        </div>
      </div>
    )
  );
};

export default Sidebar;
