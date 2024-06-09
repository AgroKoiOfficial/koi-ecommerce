import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";


export const AddShipping = ({ onClose }) => {
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [fee, setFee] = useState("");
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session || !session.user.isAdmin) {
      alert("You are not authorized to perform this action");
      return;
    }

    try {
      const res = await fetch("/api/shippings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          region,
          fee,
        }),
      });

      if (res.ok) {
        toast.success("Shipping added successfully");
        onClose();
      } else {
        const errorData = await res.json();
       console.error("Failed to add shipping:", errorData.error);
       toast.error('Shipping added failed');
      }
    } catch (error) {
      console.error("Failed to add shipping:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold">Add Shipping</h3>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="region">Region</Label>
                <Input
                  type="text"
                  id="region"
                  name="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="fee">Fee</Label>
                <Input
                  type="number"
                  id="fee"
                  name="fee"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white">
                  Submit
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white"
                  onClick={() => onClose()}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
