import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FiX, FiEdit, FiTrash2, FiPlus} from "react-icons/fi";
import AddTerm from "./AddTerm";
import EditTerm from "./EditTerm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useTheme } from 'next-themes';

const Term = () => {
  const [terms, setTerms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTermId, setEditTermId] = useState(null);
  const [editTermTitle, setEditTermTitle] = useState("");
  const [editTermContent, setEditTermContent] = useState("");
  const [deleteTermId, setDeleteTermId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await fetch("/api/term_conditions");
      const data = await response.json();
      setTerms(data.terms);
    } catch (error) {
      console.error("Error fetching terms:", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditTermId(null);
    setEditTermTitle("");
    setEditTermContent("");
  };

  const handleTermAdded = (newTerm) => {
    setTerms((prevTerms) => [...prevTerms, newTerm]);
    toggleModal();
  };

  const handleEditTerm = (term) => {
    setEditTermId(term.id);
    setEditTermTitle(term.title);
    setEditTermContent(term.content);
    setIsModalOpen(true);
  };

  const handleTermUpdated = (updatedTerm) => {
    const updatedTerms = terms.map((term) =>
      term.id === updatedTerm.id ? updatedTerm : term
    );
    setTerms(updatedTerms);
    toggleModal();
  };

  const handleDeleteTerm = (termId) => {
    setDeleteTermId(termId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTerm = async () => {
    try {
      const session = await getSession();
      const response = await fetch(`/api/term_conditions/delete/${deleteTermId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTerms((prevTerms) => prevTerms.filter((term) => term.id !== deleteTermId));
        toast.success("Term successfully deleted.");
      } else {
        toast.error(data.message || "Failed to delete term.");
      }
    } catch (error) {
      toast.error("Failed to delete term. Please try again later.");
    }
    setIsDeleteModalOpen(false);
    setDeleteTermId(null);
  };

  return (
    <div className={`flex flex-col justify-center py-8 relative ${theme === "dark" ? "bg-gray-900" : ""}`}>
      <h1 className="text-4xl text-center mb-8 font-bold">Terms & Services</h1>
      <div className="flex flex-col items-center justify-center w-full px-4">
        {terms.length > 0 ? (
          terms.map((term) => (
            <div
              key={term.id}
              className={`mb-8 p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md w-full max-w-2xl`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{term.title}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded"
                    onClick={() => handleEditTerm(term)}
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                    onClick={() => handleDeleteTerm(term.id)}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
              <div
                className="text-lg text-justify mt-4"
                dangerouslySetInnerHTML={{ __html: term.content }}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada Term & Service.</p>
        )}
      </div>
      <button
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full shadow-lg"
        onClick={toggleModal}
      >
        <FiPlus size={24} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md mx-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={toggleModal}
            >
              <FiX size={24} />
            </button>
            {editTermId ? (
              <EditTerm
                termId={editTermId}
                initialTitle={editTermTitle}
                initialContent={editTermContent}
                onClose={toggleModal}
                onTermUpdated={handleTermUpdated}
              />
            ) : (
              <AddTerm onClose={toggleModal} onTermAdded={handleTermAdded} />
            )}
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTerm}
      />
    </div>
  );
};

export default Term;
