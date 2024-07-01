import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import AddAbout from "./AddAbout";
import EditAbout from "./EditAbout";

const AdminAbout = () => {
  const [about, setAbout] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [currentAbout, setCurrentAbout] = useState({
    id: "",
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

  useEffect(() => {
    const fetchAbout = async () => {
      const response = await fetch("/api/abouts");
      const data = await response.json();
      setAbout(data);
    };
    fetchAbout();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`/api/abouts/delete/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("About deleted successfully");
      const newAbouts = about.filter((item) => item.id !== id);
      setAbout(newAbouts);
    } else {
      toast.error("Failed to delete about");
    }
  };

  const openEditModal = (item) => {
    setCurrentAbout(item);
    setModalEdit(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-3xl lg:text-4xl text-center font-bold mb-4">Tentang Kami</h1>
      <div className="flex justify-end w-1/6">
      <Button
        className="bg-blue-500 text-white  self-start mb-4"
        onClick={() => setModal(true)}
      >
        Add About
      </Button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {about?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-md"
          >
            <h2 className="text-xl lg:text-3xl text-center font-bold mb-4 lg:mb-8">{item.title}</h2>
            <img src={item.image} alt={item.title} className="rounded-md" />
            <p className="text-gray-700 mt-4">{item.content}</p>
            <div className="flex justify-end gap-2 w-1/5">
              <Button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => openEditModal(item)}
              >
                Edit
              </Button>
              <Button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <AddAbout
          setModal={setModal}
          setAbout={setAbout}
          about={about}
        />
      )}
      {modalEdit && (
        <EditAbout
          setModalEdit={setModalEdit}
          setAbout={setAbout}
          about={about}
          currentAbout={currentAbout}
          setCurrentAbout={setCurrentAbout}
        />
      )}
    </div>
  );
};

export default AdminAbout;
