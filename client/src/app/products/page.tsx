"use client";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "../(components)/Header";
import CreateProductModal from "./CreateProductModal";

/*
// How form data is processed?
// CreateProductModal have on 3 props that can be passed in and return back.
// When user submit the form in the popup, the formData is send to onCreate, which eventually passed back to Product page.
// Which then trigger handleCreateProduct, and go through all the APIs.
*/

// Key Concepts in This Flow
// State Propagation: formData flows up from CreateProductModal to Products via the onCreate prop.
// Separation of Concerns: CreateProductModal only manages the UI and form handling, while Products handles API logic.

type ProductFormData = {
  name: string;
  sku: string;
  productImg: string;
  price: number;
  stockQuantity: number;
  collectionId: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  // Receive formData from Modal and feed into ProductFormData via onCreate prop in CreateProductModal component.
  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  const [deleteProduct] = useDeleteProductMutation();
  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR*/}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2"></SearchIcon>
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products"></Header>
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200"></PlusCircleIcon>
          Product
        </button>
      </div>

      {/* BODY PRODUCT LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products?.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center">
                img
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800">${product.price.toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock: {product.stockQuantity}
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.productId)}
                  type="button"
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      ></CreateProductModal>
    </div>
  );
};

export default Products;
