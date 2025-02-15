import React, { useEffect, useState } from "react";
import Header from "../(components)/Header";

type CollectionFormData = {
  name: string;
};

type EditCollectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectionFormData | null;
  collectionId: number | null;
  onEdit: (collectionId: number, updatedData: CollectionFormData) => void;
};

const EditCollectionModal = ({
  isOpen,
  onClose,
  collection,
  collectionId,
  onEdit,
}: EditCollectionModalProps) => {
  const [formData, setFormData] = useState({
    name: collection?.name || "",
  });

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
      });
    }
  }, [collection]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(collection);
    console.log(collectionId);
    if (collection) {
      if (collectionId != null) onEdit(collectionId, formData); // Pass updated data to the parent
    }
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Edit Collection"></Header>
        <form onSubmit={handleSubmit} className="mt-5">
          {/* COLLECTION NAME */}
          <label htmlFor="collectionName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            className={inputCssStyles}
            required
            onChange={handleChange}
          ></input>

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCollectionModal;
