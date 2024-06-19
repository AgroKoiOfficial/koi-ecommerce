import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash } from "react-icons/fi";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import EditAddress from "@/components/users/address/EditAddress";
import CreateAddress from "@/components/users/address/CreateAddress";

const AddressInfo = () => {
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const session = await getSession();
        if (session && session.user) {
          const userId = session.user.id;
          const response = await fetch(`/api/address/userId/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setAddresses(data);
          } else {
            console.error("Failed to fetch address data:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };

    fetchAddress();
  }, []);

  const handleDelete = async (addressId) => {
    try {
      const response = await fetch(`/api/address/delete/${addressId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedAddresses = addresses.filter(
          (address) => address.id !== addressId
        );
        toast.success("Address deleted successfully");
        setAddresses(updatedAddresses);
      } else {
        toast.error("Failed to delete address");
        console.error("Failed to delete address:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleEdit = (address) => {
    setIsEditing(address);
  };

  const handleCreate = () => setIsCreating(true);

  return (
    <div className="flex flex-col gap-4 p-4 w-full mx-auto">
      <h1 className="text-3xl font-bold text-center">Address Info</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="w-full p-4 border rounded-lg shadow-md h-3/4">
              <h2 className="text-2xl font-bold mb-4 text-center">Address</h2>
              <div className="flex flex-col gap-2">
                <div className="mb-2">
                  <p className="text-lg ">
                    <span className="font-semibold">Street Address:</span>{" "}
                    {address.street}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">Postal Code: </span>
                    {""} {address.postalCode}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">City:</span> {address.city}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">Province:</span> {address.province}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">Phone:</span> {address.phone}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button
                  onClick={() => handleEdit(address)}
                  className={`bg-blue-500 hover:bg-blue-700 text-white`}
                  icon={<FiEdit />}
                  />
                <Button
                  onClick={() => handleDelete(address.id)}
                  className={`ml-2 bg-red-500 hover:bg-red-700 text-white`}
                  icon={<FiTrash />}
                  />
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg">No address found. Please add an address.</p>
        )}
      </div>
      <Button
        onClick={handleCreate}
        className={`bg-blue-500 hover:bg-blue-700 text-white`}>
        Add Address
      </Button>
      {isEditing && (
        <EditAddress address={isEditing} setIsEditing={setIsEditing} />
      )}
      {isCreating && <CreateAddress setIsCreating={setIsCreating} />}
    </div>
  );
};

export default AddressInfo;
