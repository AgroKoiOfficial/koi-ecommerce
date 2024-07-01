import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaPhone } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";

const CompanyContact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch("/api/company_contacts");
      const data = await response.json();
      setContacts(data);
    };
    fetchContacts();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "address":
        return <FaMapMarkedAlt className="text-4xl text-blue-500" />;
      case "phone":
        return <FaPhone className="text-4xl text-green-500" />;
      case "email":
        return <MdMarkEmailUnread className="text-4xl text-red-500" />;
      default:
        return null;
    }
  };

  const getTitle = (type) => {
    switch (type) {
      case "address":
        return "Alamat";
      case "phone":
        return "Telepon";
      case "email":
        return "Email";
      default:
        return "";
    }
  };

  const renderContactInfo = (contact) => {
    const contactInfo = [];
    if (contact.address) {
      contactInfo.push({
        type: "address",
        content: contact.address,
      });
    }
    if (contact.phone) {
      contactInfo.push({
        type: "phone",
        content: contact.phone,
      });
    }
    if (contact.email) {
      contactInfo.push({
        type: "email",
        content: contact.email,
      });
    }
    return contactInfo;
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 p-4 lg:p-8">
      <h1 className="text-3xl lg:text-4xl text-center font-bold mb-4 lg:mb-8">Hubungi Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(contacts) &&
          contacts.map((contact) =>
            renderContactInfo(contact).map((info, index) => (
              <div key={`${contact.id}-${info.type}-${index}`} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center mb-4">
                  {getIcon(info.type)}
                </div>
                <p className="text-xl text-center font-bold mb-2 lg:mb-4">{getTitle(info.type)}</p>
                <p className="text-gray-700 text-center">{info.content}</p>
              </div>
            ))
          )}
      </div>
    </div>
  );
};

export default CompanyContact;
