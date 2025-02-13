"use client";

import {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useEditCollectionMutation,
  useGetCollectionQuery,
} from "@/state/api";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "../(components)/Header";
import { create } from "domain";
import { Pencil, Trash2 } from "lucide-react";
import EditCollectionModal from "./EditCollectionModal";

type CollectionFormData = {
  name: string;
};

const labelCssStyles = "block text-sm font-medium text-gray-700";
const inputCssStyles =
  "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

const Collections = () => {
  const { data: collections, isError, isLoading } = useGetCollectionQuery();
  const [collectionData, setCollectionData] = useState({ name: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionFormData | null>();
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [createCollection] = useCreateCollectionMutation();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [editCollection] = useEditCollectionMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCollectionData({ name: e.target.value });
  };

  const handleSubmit = async (collectionData: CollectionFormData) => {
    await createCollection(collectionData);
  };

  const handleEditProduct = async (
    collectionId: number,
    updatedData: CollectionFormData
  ) => {
    await editCollection({ collectionId, updatedData });
  };

  const handleDelete = async (collectionId: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this collection?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCollection(collectionId); // Trigger the delete mutation
      alert("Collection deleted successfully!");
    } catch (error) {
      console.error("Failed to delete the collection:", error);
      alert("Failed to delete the collection.");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "collectionId",
      headerName: "ID",
      width: 50,
      valueGetter: (value, row) => row.collectionId,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      type: "string",
      valueGetter: (value, row) => row.name,
    },
    {
      field: "actions",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <button onClick={() => handleDelete(params.row.collectionId)}>
          <Trash2 className="w-5 h-5"></Trash2>
        </button>
      ),
    },
    {
      field: "editAction",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <button
          onClick={() => {
            console.log(params);
            setSelectedCollection(params.row);
            setSelectedCollectionId(params.row.collectionId);
            setIsEditModalOpen(true);
          }}
        >
          <Pencil className="w-5 h-5"></Pencil>
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text center text-red-500 py-4">
        Failed to fetch Collections data.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Collection"></Header>
      <div className="grid grid-cols-2">
        <div className="flex flex-col">
          <form onSubmit={() => handleSubmit(collectionData)} className="mt-5">
            {/* PRODUCT NAME */}
            <label htmlFor="productName" className={labelCssStyles}>
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={inputCssStyles}
              onChange={handleChange}
              required
            ></input>

            {/* CREATE ACTIONS */}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </form>
        </div>
        <DataGrid
          rows={collections}
          columns={columns}
          getRowId={(row) => row.collectionId}
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        ></DataGrid>
      </div>
      <EditCollectionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        collection={selectedCollection ?? null}
        collectionId={selectedCollectionId}
        onEdit={handleEditProduct}
      ></EditCollectionModal>
    </div>
  );
};

export default Collections;
