"use client";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetCollectionQuery,
  useGetProductsQuery,
} from "@/state/api";
import { Pencil, Plus, SearchIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import Header from "../(components)/Header";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";

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
  productImage: string;
  price: number;
  stockQuantity: number;
  collectionId: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] =
    useState<ProductFormData | null>();
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery({ search: searchTerm });
  const { data: collections } = useGetCollectionQuery();
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [editProduct] = useEditProductMutation();

  // Receive formData from Modal and feed into ProductFormData via onCreate prop in CreateProductModal component.
  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(productId); // Trigger the delete mutation
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete the product:", error);
      alert("Failed to delete the product.");
    }
  };

  const handleEditProduct = async (
    productId: string,
    updatedData: ProductFormData
  ) => {
    await editProduct({ productId, updatedData });
  };

  // CSS Styling
  const actionIconStyle = "w-4 h-4 text-gray-500 hover:bg-black";
  const actionIconButton = "p-2 hover:bg-gray-200 rounded transition-all";

  // Grid Column Data
  const columns: GridColDef[] = [
    {
      field: "productImage",
      headerName: "Thumbnail",
      width: 128,
      type: "string",
      renderCell: (params) =>
        params.row.productImage != null ? (
          <Image
            src={params.row.productImage}
            alt={`${params.row.productName}'s Image`}
            width={42}
            height={42}
            className="rounded"
          ></Image>
        ) : (
          <div className="w-12 h-12 bg-slate-200 rounded"></div>
        ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      valueGetter: (value, row) => `${row.name}`,
    },
    {
      field: "sku",
      headerName: "SKU",
      width: 100,
      valueGetter: (value, row) => `${row.sku}`,
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      type: "number",
      valueGetter: (value, row) => `RM ${row.price.toFixed(2)}`,
    },
    {
      field: "stockQuantity",
      headerName: "Stock",
      width: 120,
      type: "number",
      valueGetter: (value, row) => `${row.stockQuantity}`,
    },
    {
      field: "collection",
      headerName: "Collection",
      width: 150,
      type: "string",
      valueGetter: (value, row) =>
        collections?.find((val) => val.collectionId === row.collectionId)?.name,
    },
    {
      field: "editAction",
      headerName: "Edit",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <button
          className={actionIconButton}
          onClick={() => {
            setSelectedProduct(params.row);
            setSelectedProductId(params.row.productId);
            setIsEditModalOpen(true);
          }}
        >
          <Pencil className={actionIconStyle}></Pencil>
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "Delete",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <button
          className={actionIconButton}
          onClick={() => handleDeleteProduct(params.row.productId)}
        >
          <Trash2 className={actionIconStyle}></Trash2>
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
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products"></Header>
        <div className="flex gap-3">
          {/* SEARCH BAR*/}
          <div className="border border-gray-200 rounded w-auto">
            <div className="flex items-center ">
              <SearchIcon className="w-4 h-4 text-gray-500 mx-4"></SearchIcon>
              <input
                className="w-full py-2 px-4 rounded bg-white"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></input>
            </div>
          </div>
          {/* ADD PRODUCT BUTTON */}
          <button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2"></Plus>
            Product
          </button>
        </div>
      </div>

      {/* BODY PRODUCT TABLE */}
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
        rowHeight={48}
        columnHeaderHeight={48}
        hideFooter
        className="bg-white"
      ></DataGrid>

      {/* BODY PRODUCT LIST */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-between">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products?.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col">
                <div className="w-full h-48 bg-slate-200 rounded mb-2"></div>
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800">RM {product.price.toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock: {product.stockQuantity}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedProductId(product.productId);
                      setIsEditModalOpen(true);
                    }}
                    type="button"
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.productId)}
                    type="button"
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div> */}

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      ></CreateProductModal>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct ?? null}
        productId={selectedProductId}
        onEdit={handleEditProduct}
      ></EditProductModal>
    </div>
  );
};

export default Products;
