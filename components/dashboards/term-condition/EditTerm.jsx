import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import { FiX } from "react-icons/fi";

const EditTerm = ({ termId, initialTitle, initialContent, onClose, onTermUpdated }) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error("You do not have permission to edit terms and conditions.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const session = await getSession();
      console.log("Session in handleSubmit:", session);
      const response = await fetch(`/api/term_conditions/update/${termId}`, {
        method: "PUT",
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
        onTermUpdated(data);
        onClose();
        toast.success("Term successfully updated.");
      } else {
        toast.error(data.message || "Failed to update term.");
      }
    } catch (error) {
      toast.error("Failed to update term. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center py-2">
      <h1 className="text-4xl text-center mb-4 font-bold">Edit Term & Service</h1>
      <div className="flex flex-col items-center justify-center w-full">
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="edit-content">Content</Label>
          <TextArea
            id="edit-content"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EditTerm;
