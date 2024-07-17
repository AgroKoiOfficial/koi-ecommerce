import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { AddService } from "./AddService";
import { EditService } from "./EditService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTheme } from 'next-themes';

const ServiceTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [editService, setEditService] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/services`);
      const data = await response.json();
      setServices(data);
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  const handleCloseModal = () => {
    setModal(false);
  }

  const handleEdit = (service) => {
    setEditService(service);
    setModalEdit(true);
  };

  const handleCloseEdit = () => {
    setModalEdit(false);
    setEditService(null);
  }

  const handleDelete = async (id) => {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      console.error("Unauthorized");
      return;
    }
    await fetch(`/api/services/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Service deleted successfully");
        const updatedServices = services.filter((service) => service.id !== id);
        setServices(updatedServices);
      })
      .catch((error) => {
        toast.error("Failed to delete service");
        console.error("Failed to delete service:", error);
      });
  };

  const handleAdd = () => {
    setModal(true);
  };

  const columns = [
    { header: "No", accessorKey: "No" },
    { header: "Title", accessorKey: "Title" },
    { header: "Content", accessorKey: "Content" },
    { header: "Actions", accessorKey: "Actions" },
  ];

  const data = Array.isArray(services) && services.map((service, index) => ({
    No: index + 1,
    Title: service.title,
    Content: service.content,
    Actions: (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="bg-gray-200 text-gray-700">Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="right">
          <DropdownMenuItem onClick={() => handleEdit(service)}>
            <FiEdit className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(service.id)}>
            <FiTrash className="mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }));

  return (
    <div className="container mx-auto overflow-auto scrollbar-hide">
      <div className="flex items-center space-x-2 mt-2 md:mt-0">
        <Button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          icon={<FiPlusCircle />}
        >
          <FiPlusCircle />
        </Button>
      </div>
      {modal && <AddService onClose={handleCloseModal} />}
      {modalEdit && editService && <EditService onClose={handleCloseEdit} service={editService} />}
      <div className="container overflow-auto scrollbar-hide">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey}
                  className={`px-4 py-2 text-left text-sm font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-600"
                  }`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className={`hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                {Object.values(row).map((cell, idx) => (
                  <TableCell key={idx} className={`px-4 py-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ServiceTable;
