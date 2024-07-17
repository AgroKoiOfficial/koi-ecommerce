import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import { useTheme } from "next-themes";

const AddTerm = ({ onClose, onTermAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session && session.user && session.user.role === "ADMIN") {
        setIsAdmin(true);
      }
    };

    fetchSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("You do not have permission to add terms and conditions.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const session = await getSession();
      const response = await fetch("/api/term_conditions/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.id) {
          onTermAdded(data);
          onClose();
          toast.success("Term successfully added.");
        } else {
          toast.error(data.message || "Failed to add term.");
        }
      } else {
        toast.error("Failed to add term. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to add term. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center py-2">
      <h1 className="text-4xl text-center mb-4 font-bold">
        Add Terms & Service
      </h1>
      <div className="flex flex-col items-center justify-center w-full">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="content">Content</Label>
            <TextArea
              id="content"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTerm;
