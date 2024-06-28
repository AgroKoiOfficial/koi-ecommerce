import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { AddService } from "./AddService";
import { EditService } from "./EditService";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

const ServiceTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [editService, setEditService] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

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

  const columns = ["No", "Title", "Content", "Action"];

  const data =
    Array.isArray(services) &&
    services.map((service, index) => {
      return {
        No: index + 1,
        Title: service.title,
        Content: service.content,
        Action: (
          <div className="flex max-w-[25%] items-center justify-center space-x-1 mx-auto">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              icon={<FiEdit />}
              onClick={() => handleEdit(service)}
            />
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              icon={<FiTrash />}
              onClick={() => handleDelete(service.id)}
            />
          </div>
        ),
      };
    });

    const handleCloseModal = () => {
      setModal(false);
    }

  const handleEdit = (service) => {
    setEditService(service)
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

  return (
    <div className="container mx-auto overflow-auto scrollbar-hide">
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            icon={<FiPlusCircle />}
          />
        </div>
        {modal && <AddService onClose={handleCloseModal} />}
        {modalEdit && editService &&  <EditService onClose={handleCloseEdit} service={editService} /> }
        <div className="container overflow-auto scrollbar-hide">
          <Table columns={columns} data={data} />
        </div>
      </div>
  );
};

export default ServiceTable;