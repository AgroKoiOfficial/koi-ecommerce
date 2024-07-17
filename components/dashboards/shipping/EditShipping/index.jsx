import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useTheme } from 'next-themes';

export const EditShipping = ({ shipping, onClose }) => {
  const [city, setCity] = useState(shipping.city);
  const [region, setRegion] = useState(shipping.region);
  const [fee, setFee] = useState(shipping.fee);
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

    if (!city) {
      setError("City is required");
      return;
    }

    if (!region) {
      setError("Region is required");
      return;
    }

    if (!fee) {
      setError("Fee is required");
      return;
    }

    if (!session || !session.user.isAdmin) {
      setError("You are not authorized to perform this action");
      return;
    }

    const response = await fetch(`/api/shippings/update/${shipping.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city, region, fee }),
    });

    if (response.ok) {
      toast.success("Shipping updated successfully");
      setSuccess("Shipping updated successfully");
      onClose();
    } else {
      toast.error("Failed to update shipping");
      setError("Failed to update shipping");
    }
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl">
        <div className={`relative flex flex-col w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-0 rounded-lg shadow-lg outline-none focus:outline-none`}>
          <div className="flex items-start justify-between p-3 ">
            <h3 className="text-xl font-semibold">Edit Shipping</h3>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Fee"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center space-x-4 p-6">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white">
                  Save
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => onClose()}>
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
