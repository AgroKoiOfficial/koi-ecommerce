import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import AddContact from "./AddContact";
import EditContact from "./EditContact";

const CompanyContact = () => {
  const [contact, setContact] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    id: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        window.location.href = "/login";
      }
    });
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      const response = await fetch("/api/company_contacts");
      const data = await response.json();
      setContact(data);
    };
    fetchContact();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`/api/company_contacts/delete/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("Contact deleted successfully");

      const newContacts = contact.filter((item) => item.id !== id);
      setContact(newContacts);
    } else {
      toast.error("Failed to delete contact");
    }
  };

  const openEditModal = (item) => {
    setCurrentContact(item);
    setModalEdit(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-3xl lg:text-4xl text-center font-bold mb-4">
        Hubungi Kami
      </h1>
      <div className="flex justify-end w-1/6">
        <Button
          className="bg-blue-500 text-white self-start mb-4"
          onClick={() => setModal(true)}>
          Add Contact
        </Button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="py-2">No</th>
            <th className="py-2">Address</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Email</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {contact.map((item, index) => (
            <tr key={item.id}>
              <td className="py-2 text-center">{index + 1}</td>
              <td className="py-2 text-center">{item.address}</td>
              <td className="py-2 text-center">{item.phone}</td>
              <td className="py-2 text-center">{item.email}</td>
              <td className="py-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  <Button
                    className="bg-blue-500 text-white"
                    onClick={() => openEditModal(item)}>
                    Edit
                  </Button>
                  <Button
                    className="bg-red-500 text-white"
                    onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal && (
        <AddContact
          setModal={setModal}
          setContact={setContact}
          contact={contact}
        />
      )}
      {modalEdit && (
        <EditContact
          setModalEdit={setModalEdit}
          setContact={setContact}
          contact={contact}
          currentContact={currentContact}
        />
      )}
    </div>
  );
};

export default CompanyContact;
