import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "../(components)/Header";
import { useGetCollectionQuery } from "@/state/api";

type ProductFormData = {
  name: string;
  sku: string;
  productImg: string;
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
    productImg: "",
    price: 0,
    stockQuantity: 0,
    collectionId: 1,
  });

  const { data: collections, isLoading, isError } = useGetCollectionQuery();

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
          ? parseFloat(value)
          : value,
    });

    console.log(formData);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product"></Header>
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
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
            placeholder="SKU"
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
            placeholder="Price"
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
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          ></input>

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create
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

export default CreateProductModal;
