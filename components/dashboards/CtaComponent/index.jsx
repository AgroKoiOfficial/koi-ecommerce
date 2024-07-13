import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { getCta, createCta, updateCta, deleteCta } from "./cta-api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { TextArea } from "@/components/ui/TextArea";

const CtaComponent = () => {
  const [ctaList, setCtaList] = useState([]);
  const [session, setSession] = useState(null);
  const [editCta, setEditCta] = useState(null);
  const [showCtaForm, setShowCtaForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        setSession(session);

        const data = await getCta();
        setCtaList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch CTA data");
      }
    };

    fetchData();
  }, []);

  const handleCreate = async (data) => {
    try {
      const newCta = await createCta(data);
      toast.success("Cta created successfully!");
      setCtaList([newCta, ...ctaList]);
      setShowCtaForm(false);
    } catch (error) {
      toast.error("Failed to create cta");
      console.error("Error creating cta:", error);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updatedCta = await updateCta(id, data);
      const updatedList = ctaList.map((item) =>
        item.id === id ? updatedCta : item
      );
      setCtaList(updatedList);
      toast.success("Cta updated successfully!");
      setShowCtaForm(false);
    } catch (error) {
      toast.error("Failed to update cta");
      console.error("Error updating cta:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCta(id);
      const updatedList = ctaList.filter((item) => item.id !== id);
      setCtaList(updatedList);
      toast.success("Cta deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete cta");
      console.error("Error deleting cta:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-end w-1/4">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
          onClick={() => setShowCtaForm(!showCtaForm)}>
          {showCtaForm ? "Cancel" : "Create Cta"}
        </Button>
      </div>
      {showCtaForm && (
        <div className="p-4 bg-white shadow-lg rounded-lg mt-8">
          <h1 className="text-3xl font-bold mb-4">Create Cta</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate({
                name: e.target.name.value,
                phoneNumber: e.target.phoneNumber.value,
                message: e.target.message.value,
                active: e.target.active.checked,
              });
            }}>
            <div className="mb-4">
              <Label> Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                name="name"
                required
              />
            </div>
            <div className="mb-4">
              <Label>Phone Number</Label>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="Phone Number use 62"
                name="phoneNumber"
                required
              />
            </div>
            <div className="mb-4">
              <Label>Message</Label>
              <TextArea
                rows={4}
                id="message"
                placeholder="Message"
                name="message"
                required
              />
            </div>
            <div className="mb-4">
              <Label>Active</Label>
              <input
                id="active"
                type="checkbox"
                name="active"
                defaultChecked={true}
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white"
                type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
      <div>
        {ctaList.map((cta) => (
          <div key={cta.id} className="p-4 bg-white shadow-lg rounded-lg mt-8">
            <h1 className="text-3xl font-bold mb-4">Customer Service</h1>
            <p className="text-lg mb-4">
              <span className="font-semibold">Name:</span> {cta.name}
            </p>
            <p className="text-lg mb-4">
              <span className="font-semibold">Phone Number:</span>{" "}
              {cta.phoneNumber}
            </p>
            <p className="text-lg mb-4">
              <span className="font-semibold">Active:</span>{" "}
              {cta.active ? "Yes" : "No"}
            </p>
            <p className="text-lg mb-4">
              <span className="font-semibold">Message:</span> {cta.message}
            </p>
            <div className="flex justify-end w-1/6 items-end gap-4 mx-8">
              <Button
                className="bg-yellow-500 hover:bg-yellow-700 text-white"
                onClick={() => {
                  setEditCta(cta);
                  setShowCtaForm(true);
                }}>
                Edit
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-700 text-white"
                onClick={() => handleDelete(cta.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CtaComponent;
