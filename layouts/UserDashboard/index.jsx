import React, { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import Navbar from '@/components/users/ui/Navbar';
import Sidebar from '@/components/users/ui/Sidebar';


const UserDashboard = ({ children, title }) => {
    const [isNavbar, setIsNavbar] = useState(false);
    const [isSidebar, setIsSidebar] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 0) {
          setIsNavbar(true);
        } else {
          setIsNavbar(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  
    const toggleSidebar = () => {
      setIsSidebar(!isSidebar);
    };
  
    const toggleCloseSidebar = () => {
      setIsSidebar(false);
    };
  
    const handleLogout = () => {
      signOut();
    };
    
    return (
        <main className="flex overflow-auto scrollbar-hide ">
          <Sidebar isSidebar={isSidebar} toggleCloseSidebar={toggleCloseSidebar} />
    
          <div className="flex-1 pl-0 md:pl-32 lg:pl-64">
            <Navbar
              isNavbar={isNavbar}
              toggleSidebar={toggleSidebar}
              handleLogout={handleLogout}
              title={title}
            />
            <main className="p-4 mt-2">{children}</main>
          </div>
        </main>
      );
        
    
};

export default UserDashboard;