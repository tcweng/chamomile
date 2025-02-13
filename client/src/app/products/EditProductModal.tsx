import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Header from "../(components)/Header";
import { useGetCollectionQuery } from "@/state/api";
import { Divide, Save } from "lucide-react";
import { Divider } from "@mui/material";

type ProductFormData = {
  name: string;
  sku: string;
  productImg: string;
  price: number;
  stockQuantity: number;
  collectionId: number;
};

type EditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: ProductFormData | null;
  productId: string | null;
  onEdit: (productId: string, updatedData: ProductFormData) => void;
};

// Prepopulate the Form with Current Data
const EditProductModal = ({
  isOpen,
  onClose,
  product,
  productId,
  onEdit,
}: EditProductModalProps) => {
  const { data: collections, isLoading, isError } = useGetCollectionQuery();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    productImg: product?.productImg || "",
    price: product?.price || 0,
    stockQuantity: product?.stockQuantity || 0,
    collectionId: product?.collectionId || 0,
  });

  // Update formData when the modal receives a new product
  useEffect(() => {
    console.log(product);
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        productImg: product.productImg,
        price: product.price,
        stockQuantity: product.stockQuantity,
        collectionId: product.collectionId,
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "collectionId"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      if (productId) onEdit(productId, formData); // Pass updated data to the parent
    }
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block font-medium mb-1";
  const inputCssStyles =
    "block w-full mb-4 p-2 border-gray-300 border rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-500 backdrop-blur-md bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center">
      <div className="relative mx-auto py-6 px-7 w-1/4 shadow-lg rounded-lg bg-white">
        <Header name="Edit Product"></Header>
        <Divider className="py-2"></Divider>
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
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

          {/* SKU */}
          <label htmlFor="productName" className={labelCssStyles}>
            SKU
          </label>
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            className={inputCssStyles}
            required
            onChange={handleChange}
          ></input>

          {/* COLLECTION */}
          <label htmlFor="collection" className={labelCssStyles}>
            Collection
          </label>
          <select
            className={inputCssStyles}
            name="collectionId"
            required
            value={formData.collectionId}
            onChange={handleChange}
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
            value={formData.price}
            className={inputCssStyles}
            required
            onChange={handleChange}
          ></input>

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
            onChange={handleChange}
          ></input>

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
            <Save className="inline w-4 h-4 mr-1 -mt-1"></Save> Save
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

export default EditProductModal;
