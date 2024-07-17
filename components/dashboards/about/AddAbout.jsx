import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

const AddAbout = ({ setModal, setAbout, about }) => {
  const { theme } = useTheme();
  const [currentAbout, setCurrentAbout] = useState({
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        window.location.href = "/login";
      }
    });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    const session = await getSession();
    if (!session) {
      window.location.href = "/login";
    }

    const formData = new FormData();
    formData.append("title", currentAbout.title);
    formData.append("content", currentAbout.content);
    formData.append("image", currentAbout.image);

    const response = await fetch("/api/abouts/create", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      toast.success("About added successfully");
      const newAbout = await response.json();
      setAbout([...about, newAbout]);
      setModal(false);
    } else {
      toast.error("Failed to add about");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} p-6 rounded-lg shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Add About</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            placeholder="Title"
            value={currentAbout.title}
            onChange={(e) =>
              setCurrentAbout({ ...currentAbout, title: e.target.value })
            }
          />

          <Label htmlFor="image">Image</Label>
          <Input
            type="file"
            onChange={(e) =>
              setCurrentAbout({ ...currentAbout, image: e.target.files[0] })
            }
          />

          <Label htmlFor="content">Content</Label>
          <TextArea
            placeholder="Content"
            value={currentAbout.content}
            onChange={(e) =>
              setCurrentAbout({ ...currentAbout, content: e.target.value })
            }
          />
          <div className="flex justify-center space-x-4 gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700"
              onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAbout;
