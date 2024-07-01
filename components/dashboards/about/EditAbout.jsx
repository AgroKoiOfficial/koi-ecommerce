import React from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";


const EditAbout = ({
  setModalEdit,
  setAbout,
  about,
  currentAbout,
  setCurrentAbout,
}) => {
  const handleEdit = async (e) => {
    e.preventDefault();

    const session = await getSession();
    if (!session) {
      window.location.href = "/login";
    }

    const formData = new FormData();
    formData.append("title", currentAbout.title);
    formData.append("content", currentAbout.content);
    if (currentAbout.image) {
      formData.append("image", currentAbout.image);
    }

    const response = await fetch(`/api/abouts/update/${currentAbout.id}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      toast.success("About updated successfully");
      const updatedAbout = await response.json();
      const updatedAbouts = about.map((item) =>
        item.id === currentAbout.id ? updatedAbout : item
      );
      setAbout(updatedAbouts);
      setModalEdit(false);
    } else {
      toast.error("Failed to update about");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit About</h2>
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
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
            className="border p-2 rounded-md"
          />

          <Label htmlFor="content">Content</Label>
          <TextArea
            placeholder="Content"
            value={currentAbout.content}
            onChange={(e) =>
              setCurrentAbout({ ...currentAbout, content: e.target.value })
            }
            className="border p-2 rounded-md"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700"
              onClick={() => setModalEdit(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAbout;
