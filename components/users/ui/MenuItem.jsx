import React, {useState} from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useTheme } from "next-themes";

const MenuItem = ({icon, title, submenu, href }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { theme, setTheme } = useTheme();

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li className={`table-captionpx-4 py-2 transition-colors duration-200 ease-in-out hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="flex items-center justify-between cursor-pointer" onClick={handleClick}>
          <div className="flex items-center ml-4 pr-4">
            {icon}
            <a href={href} className="ml-2">{title}</a>
          </div>
          {submenu && (isOpen ? <FiChevronDown className="h-4 w-4 ml-auto" /> : <FiChevronRight className="h-4 w-4 ml-auto" />)}
        </div>
        {submenu && isOpen && (
          <ul className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} ${theme === 'dark' ? 'text-white' : 'text-black'} rounded p-2`}>
            {submenu.map((item, index) => (
              <li key={index} className="flex items-center px-4 py-2">
                {item.icon}
                <a href={item.href} className="ml-2">{item.title}</a>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
}

export default MenuItem