import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

const AddContact = ({ setModal, setContact, contact }) => {
  const { theme } = useTheme();
  const [currentContact, setCurrentContact] = useState({
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

  const handleAdd = async (e) => {
    e.preventDefault();
  
    const session = await getSession();
    if (!session) {
      window.location.href = "/login";
    }
  
    const response = await fetch("/api/company_contacts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: currentContact.address,
        phone: currentContact.phone,
        email: currentContact.email,
      }),
    });
  
    if (response.ok) {
      toast.success("Contact added successfully");
      const newContact = await response.json();
      setContact([...contact, newContact]);
      setModal(false);
    } else {
      toast.error("Failed to add contact");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Add Contact</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            placeholder="Address"
            value={currentContact.address}
            onChange={(e) =>
              setCurrentContact({ ...currentContact, address: e.target.value })
            }
          />
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="text"
            placeholder="Phone"
            value={currentContact.phone}
            onChange={(e) =>
              setCurrentContact({ ...currentContact, phone: e.target.value })
            }
          />
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            placeholder="Email"
            value={currentContact.email}
            onChange={(e) =>
              setCurrentContact({ ...currentContact, email: e.target.value })
            }
          />
          <div className="flex justify-center space-x-4 gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700"
              onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
