import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/${session.user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          password: "",
        });
      } catch (error) {
        console.error("An error occurred while fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const updateData = {
      name: formData.name,
      email: formData.email,
      password: formData.password ? formData.password : undefined,
    };

    const response = await fetch(`/api/user/update/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      console.error("Failed to update user");
      return;
    }

    const updatedUser = await response.json();
    toast.success("User updated successfully");
    setUser(updatedUser);
    setFormData({
      ...formData,
      password: "",
    });
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/user/delete/${user.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Failed to delete user");
      return;
    }

    toast.success("User deleted successfully");
    setUser(null);
  };

  if (loading)
    return (
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>
      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 lg:mb-8">User Details</h2>
            <div className="mb-4">
           <Label>Name:</Label>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div className="mb-4">
              <Label>Email:</Label>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Update User</h2>
            <div className="mb-4">
             <Label>Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Leave blank to keep the same"
              />
            </div>
            <div className="mb-4 flex space-x-8 lg:space-x-2 justify-between items-center">
            <Button
              className="bg-blue-500 text-white"
              onClick={handleUpdate}>
              Update
            </Button>
            <Button
              className="bg-red-500 text-white"
              onClick={handleDelete}>
              Delete
            </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">No user found.</p>
      )}
    </div>
  );
};

export default UserInfo;
