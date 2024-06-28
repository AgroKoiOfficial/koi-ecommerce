import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

export const AddService = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [session, setSession] = useState(null);

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
      const response = await fetch("/api/services/create/", {
        method: "POST",
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
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold">Tambahkan Service Konten</h3>
          </div>
          <div className="relative">
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="content">Content</Label>
                <TextArea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white ">
                 Tambah
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white"
                  onClick={() => onClose()}>
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
