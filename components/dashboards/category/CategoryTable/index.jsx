import React, { useState, useEffect } from "react";
import { Table } from "@/components/ui/Table";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi"; 
import { Button } from "@/components/ui/Button";
import { AddCategory } from "../Addcategory";
import { EditCategory } from "../EditCategory";
import { getSession } from "next-auth/react";

export const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories:", response.status);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();

    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditCategory(null);
  };

  const handleDelete = async (categoryId) => {
    try {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") {
        console.error("Unauthorized");
        return;
      }

      const response = await fetch(`/api/categories/delete/${categoryId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== categoryId));
      } else {
        console.error("Failed to delete category:", response.status);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const columns = ["No", "Name", "Action"];

  const data =
    Array.isArray(categories) &&
    categories.map((category, index) => {
      return {
        No: index + 1,
        Name: category.name,
        Action: (
          <div className="flex max-w-[25%] items-center justify-center space-x-1 mx-auto">
            <Button
              onClick={() => handleEdit(category)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              icon={<FiEdit />}
            />
            <Button
              onClick={() => handleDelete(category.id)}
              className="bg-red-500 hover:bg-red-600 text-white"
              icon={<FiTrash />}
            />
          </div>
        ),
      };
    });

  return (
    <div className="container mx-auto overflow-auto scrollbar-hide">
      <div className="max-w-[15%] my-2 px-4 sm:px-6 lg:px-8">
        <Button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white">
          <FiPlusCircle size={20}/>
        </Button>
      </div>
      {modalOpen && <AddCategory onClose={handleCloseModal} />}
      {editModalOpen && <EditCategory category={editCategory} onClose={handleCloseEditModal} />}
      <div className="container overflow-auto scrollbar-hide">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
};
