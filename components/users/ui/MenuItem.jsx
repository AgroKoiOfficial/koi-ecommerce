import React, { useState } from "react";
import { useTheme } from "next-themes";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const MenuItem = ({ icon, title, submenu, href }) => {
  const { theme } = useTheme();

  return (
    <AccordionItem value={title}>
      <AccordionTrigger
        className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
      >
        <div className="flex items-center">
          {icon}
          <a href={href} className="ml-2">{title}</a>
        </div>
      </AccordionTrigger>
      {submenu && (
        <AccordionContent className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} ${theme === 'dark' ? 'text-white' : 'text-black'} rounded p-2`}>
          <ul>
            {submenu.map((item, index) => (
              <li key={index} className="flex items-center px-4 py-2">
                {item.icon}
                <a href={item.href} className="ml-2">{item.title}</a>
              </li>
            ))}
          </ul>
        </AccordionContent>
      )}
    </AccordionItem>
  );
};

export default MenuItem;
