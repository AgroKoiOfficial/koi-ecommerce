import React from "react";
import { Button } from "@/components/ui/Button";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus?</h2>
        <p className="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus?</p>
        <div className="flex justify-end space-x-4">
          <Button
            className="bg-gray-500 hover:bg-gray-700 text-white"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
