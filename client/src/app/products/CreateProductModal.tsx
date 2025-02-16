import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "../(components)/Header";
import { useGetCollectionQuery, useUploadImageMutation } from "@/state/api";
import { Divider } from "@mui/material";

type ProductFormData = {
  name: string;
  sku: string;
  productImage: string;
  price: number;
  stockQuantity: number;
  collectionId: number;
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  // Initial State, meaning the form default value is this.
  // formData holds the form's input value, each field declare below corresponds to a form input element.
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    productImage: "",
    price: 0,
    stockQuantity: 0,
    collectionId: 0,
  });

  const { data: collections, isLoading } = useGetCollectionQuery();
  const [uploadImage] = useUploadImageMutation();

  // const uploadImageToS3 = async (file: File) => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const response = await fetch("/upload", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   const data = await response.json();
  //   console.log("Upload Response:", data); // Debug the response

  //   if (!response.ok) throw new Error("Upload failed");

  //   return data.url; // Make sure your backend returns the image URL
  // };

  // The 'name' here correspond to the name attribute in the form element.
  // So it's setting the formData state with its name's value.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "collectionId"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
    });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadImage(file).unwrap(); // Upload the file
      console.log("Uploaded image URL:", response.url);

      // Update formData with the new image URL
      setFormData((prev) => ({
        ...prev,
        productImage: response.url, // Store the uploaded image URL
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted:", formData.productImage);
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block font-medium mb-1";
  const inputCssStyles =
    "block w-full mb-4 p-2 border-gray-300 border rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-500 backdrop-blur-md bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center">
      <div className="relative mx-auto py-6 px-7 w-1/4 shadow-lg rounded-lg bg-white">
        <Header name="Create New Product"></Header>
        <Divider className="py-2"></Divider>
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT IMAGE */}
          <label htmlFor="productImage" className={labelCssStyles}>
            Product Image
          </label>
          <input
            type="file"
            name="productImage"
            accept="image/*"
            onChange={handleImageUpload}
            className={inputCssStyles}
          />
          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          ></input>

          {/* SKU */}
          <label htmlFor="productName" className={labelCssStyles}>
            SKU
          </label>
          <input
            type="text"
            name="sku"
            onChange={handleChange}
            value={formData.sku}
            className={inputCssStyles}
            required
          ></input>

          {/* COLLECTION */}
          <label htmlFor="collection" className={labelCssStyles}>
            Collection
          </label>
          <select
            className={inputCssStyles}
            name="collectionId"
            required
            onChange={handleChange}
            value={formData.collectionId}
          >
            {isLoading ? (
              <div>Loading</div>
            ) : (
              collections?.map((collection) => (
                <option
                  key={collection.collectionId}
                  value={collection?.collectionId}
                >
                  {collection?.name}
                </option>
              ))
            )}
            ;
          </select>

          {/* PRODUCT PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          ></input>

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          ></input>

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 border text-black hover:bg-gray-200 py-2 px-4 rounded transition-all"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
