import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getSession } from "next-auth/react";
import { useTheme } from 'next-themes';

export const EditCategory = ({ category, onClose }) => {
  const [name, setName] = useState(category.name);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [session, setSession] = useState(null);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is required");
      return;
    }

    if (!session || !session.user.isAdmin) {
      setError("You are not authorized to perform this action");
      return;
    }

    const response = await fetch(`/api/categories/update/${category.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      setSuccess("Category updated successfully");
      onClose();
    } else {
      setError("Failed to update category");
    }
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl">
        <div className={`relative flex flex-col w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-0 rounded-lg shadow-lg outline-none focus:outline-none`}>
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold">Edit Kategori</h3>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center space-x-4 p-4 border-slate-200 rounded-b">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white"
                  onClick={() => onClose()}
                >
                  Cancel
                </Button>
              </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};