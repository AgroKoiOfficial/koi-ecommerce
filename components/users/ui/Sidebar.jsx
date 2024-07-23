import React from "react";
import { useRouter } from "next/router";
import { FiX, FiHome,  FiList } from "react-icons/fi";
import { FaRegUser, FaUser , FaRegAddressCard  } from "react-icons/fa";
import { MdOutlineRateReview, MdOutlineShoppingCartCheckout  } from "react-icons/md";
import { Button } from "../../ui/Button";
import MenuItem from "./MenuItem";
import { useTheme } from "next-themes";

const Sidebar = ({ isSidebar, toggleSidebar, toggleCloseSidebar }) => {
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const handleBackToHome = () => {
    router.push("/");
  };
  return (
    <div
      className={`${
        isSidebar ? "w-64" : "hidden lg:block w-64"
      } fixed inset-y-0 left-0 z-40 transition-width duration-200 ease-in-out ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} shadow-lg`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="ml-2 text-xl font-bold">Agro Koi</span>
          </div>
          <button
            className={` focus:outline-none lg:hidden ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            onClick={toggleCloseSidebar}>
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <MenuItem
              icon={<FiHome className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />}
              title="Dashboard"
              href="#"
              submenu={[
                {
                  title: "Riwayat Review",
                  href: "/user/review",
                  icon: <MdOutlineRateReview className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />,
                },
              ]}
            />
            <MenuItem
              icon={<FiList className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />}
              title="Pesan"
              href="#"
              submenu={[
                { title: "Riwayat Belanja", href: "/user/checkout-history", icon: <MdOutlineShoppingCartCheckout className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} /> },
              ]}
            />
            <MenuItem
            icon={<FaRegUser  className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />}
            title={'Managemen Akun'}
            href={'#'}
            submenu={[
              { title: " Informasi Akun", href: "/user/user-management", icon: <FaUser className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}/> },
              { title: "Alamat", href: "/user/address", icon: <FaRegAddressCard className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}/> },
            ]}
            />
          </ul>
          <div className="w-[40%] md:w-auto flex  flex-1 items-center justify-center bottom-0 fixed m-8">
            <Button
              className="bg-white  hover:bg-gray-100 text-gray-900 font-semibold"
              onClick={handleBackToHome}>
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
