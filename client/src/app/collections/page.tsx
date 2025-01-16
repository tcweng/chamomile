"use client";

import {
  useCreateCollectionMutation,
  useGetCollectionQuery,
} from "@/state/api";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "../(components)/Header";
import { create } from "domain";

type CollectionFormData = {
  name: string;
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
];

const labelCssStyles = "block text-sm font-medium text-gray-700";
const inputCssStyles =
  "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

const Collections = () => {
  const { data: collections, isError, isLoading } = useGetCollectionQuery();
  const [collectionData, setCollectionData] = useState({ name: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCollectionData({ name: e.target.value });
  };

  const [createCollection] = useCreateCollectionMutation();

  const handleSubmit = async (collectionData: CollectionFormData) => {
    await createCollection(collectionData);
  };

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
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        ></DataGrid>
      </div>
    </div>
  );
};

export default Collections;
