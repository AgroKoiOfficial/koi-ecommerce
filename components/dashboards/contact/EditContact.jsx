import React from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

const EditContact = ({
  setModalEdit,
  contact,
  currentContact,
  setCurrentContact,
}) => {
  const { theme } = useTheme();

  const handleEdit = async (e) => {
    e.preventDefault();

    const session = await getSession();
    if (!session) {
      window.location.href = "/login";
    }

    const formData = new FormData();
    formData.append("address", currentContact.address);
    formData.append("phone", currentContact.phone);
    formData.append("email", currentContact.email);

    const response = await fetch(
      `/api/company_contacts/update/${currentContact.id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (response.ok) {
      toast.success("Contact updated successfully");
      const updatedContact = await response.json();
      const updatedContacts = contact.map((item) =>
        item.id === currentContact.id ? updatedContact : item
      );
      // setContact(updatedContacts); // Uncomment if needed
      setModalEdit(false);
    } else {
      toast.error("Failed to update contact");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
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
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700"
              onClick={() => setModalEdit(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContact;
