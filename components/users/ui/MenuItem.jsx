import React, {useState} from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const MenuItem = ({icon, title, submenu, href }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li className="px-4 py-2 hover:bg-gray-800">
        <div className="flex items-center justify-between cursor-pointer" onClick={handleClick}>
          <div className="flex items-center">
            {icon}
            <a href={href} className="ml-2">{title}</a>
          </div>
          {submenu && (isOpen ? <FiChevronDown className="h-4 w-4 ml-auto" /> : <FiChevronRight className="h-4 w-4 ml-auto" />)}
        </div>
        {submenu && isOpen && (
          <ul className="bg-gray-800 text-white rounded p-2">
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