import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useTheme } from "next-themes";

export const EditService = ({ service, onClose }) => {
  const [title, setTitle] = useState(service.title);
  const [content, setContent] = useState(service.content);
  const [session, setSession] = useState(null);

  const { theme } = useTheme();

  const router = useRouter();

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
      toast.error("You are not authorized to perform this action");
      return;
    }
    try {
      const response = await fetch(`/api/services/update/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }

      toast.success("Service added successfully");
      onClose();
      router.push("/dashboard/services");
    } catch (error) {
      console.error("Failed to add service:", error);
      toast.error("Failed to add service");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-4xl">
        <div className={`relative flex flex-col w-full ${theme === "dark" ? "bg-gray-900" : "bg-white"} border-0 rounded-lg shadow-lg outline-none focus:outline-none`}>
          <div className="flex items-start justify-between p-5 ">
            <h3 className="text-3xl font-semibold">Edit Konten Layanan</h3>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="content">Content</Label>
                <TextArea
                  id="content"
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-center space-x-4 p-3 ">
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
          </div>
        </div>
      </div>
    </div>
  );
};
