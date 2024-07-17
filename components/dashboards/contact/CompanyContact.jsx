import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

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

  const { theme } = useTheme();

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
      setContact(data || []);
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

  const columns = [
    { header: "No", accessorKey: "No" },
    { header: "Address", accessorKey: "Address" },
    { header: "Phone", accessorKey: "Phone" },
    { header: "Email", accessorKey: "Email" },
    { header: "Action", accessorKey: "Action" },
  ];

  const data =
    contact &&
    contact.map((item, index) => ({
      No: index + 1,
      Address: item.address,
      Phone: item.phone,
      Email: item.email,
      Action: (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="bg-gray-200 text-gray-700">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right">
            <DropdownMenuItem onClick={() => openEditModal(item)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(item.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }));

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-3xl lg:text-4xl text-center font-bold mb-4">
        Hubungi Kami
      </h1>
      <div className="flex justify-end w-1/6">
        <Button
          className="bg-blue-500 text-white self-start mb-4"
          onClick={() => setModal(true)}
        >
          Add Contact
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey}
                  className={`py-2 px-4 text-left text-sm font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-600"
                  }`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                className={`hover:${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                {Object.values(row).map((cell, idx) => (
                  <TableCell
                    key={idx}
                    className={`py-2 px-4 text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {modal && <AddContact setModal={setModal} setContact={setContact} contact={contact} />}
      {modalEdit && (
        <EditContact
          setModalEdit={setModalEdit}
          setContact={setContact}
          currentContact={currentContact}
          setCurrentContact={setCurrentContact}
          contact={contact}
        />
      )}
    </div>
  );
};

export default CompanyContact;
