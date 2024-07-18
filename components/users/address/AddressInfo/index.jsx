import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash, FiMoreVertical } from "react-icons/fi";
import { getSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import EditAddress from "@/components/users/address/EditAddress";
import CreateAddress from "@/components/users/address/CreateAddress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const AddressInfo = () => {
  const { theme } = useTheme();
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
        toast.success("Menghapus Alamat Berhasil");
        setAddresses(updatedAddresses);
      } else {
        toast.error("Gagal Menghapus Alamat");
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
    <div className={`flex flex-col gap-4 p-4 w-full mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold text-center">Informasi Alamat</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`w-full p-4 border rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-4 text-center">Alamat</h2>
              <div className="flex flex-col gap-2">
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">Jalan:</span> {address.street}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">Kode Pos: </span> {address.postalCode}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">Kota:</span> {address.city}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">Provinsi:</span> {address.province}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg">
                    <span className="font-semibold">No Telp:</span> {address.phone}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gray-500 hover:bg-gray-700 text-white">
                      <FiMoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleEdit(address)}>
                      <FiEdit className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDelete(address.id)}>
                      <FiTrash className="mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg">Tidak ada alamat.</p>
        )}
      </div>
      <Button
        onClick={handleCreate}
        className="bg-blue-500 hover:bg-blue-700 text-white">
        Alamat Baru
      </Button>
      {isEditing && (
        <EditAddress address={isEditing} setIsEditing={setIsEditing} />
      )}
      {isCreating && <CreateAddress setIsCreating={setIsCreating} />}
    </div>
  );
};

export default AddressInfo;
