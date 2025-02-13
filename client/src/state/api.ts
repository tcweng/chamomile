import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// createApi: A function from Redux Toolkit Query (RTK Query) used to define and manage API slices.
// It generates hooks for queries and mutations automatically
// fetchBaseQuery: A lightweight wrapper around the fetch API that simplifies making HTTP requests.
// It's commonly used as the base query in RTK Query.

export interface Product {
  productId: string;
  name: string;
  sku: string;
  productImg: string;
  price: number;
  stockQuantity: number;
  collectionId: number;
}

export interface NewProduct {
  name: string;
  sku: string;
  productImg: string;
  price: number;
  stockQuantity: number;
  collectionId: number;
}

export interface Collection {
  collectionId: number;
  name: string;
}

export interface NewCollection {
  name: string;
}

export interface Sale {
  saleId: string;
  productId: string;
  receiptId: string;
  timestamp: string; // ISO string for dates
  quantity: number;
  unitPrice?: number;
  totalAmount: number;
  remark?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  remark?: string;
}

export interface SaleReceipt {
  cart: CartItem[];
  total: number;
  remark?: string;
  sales?: Sale[];
}

export interface DashboardMetrics {
  popularProducts: Product[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }), // Set the base URL for all API request
  reducerPath: "api", // Sets the key in the Redux store where the API state will be stored
  tagTypes: [
    "DashboardMetrics",
    "Products",
    "Users",
    "Sales",
    "SalesReceipt",
    "Collections",
  ], // Used to track and invalidate cache for specific resources
  endpoints: (build) => ({
    // build.query = GET request
    // build.mutation = set POST/DELETE method in method parameters.
    // query<Response Type, parameters>
    // provideTags: [tagTypes] - Indicate this cache tag type to refresh when query successful

    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard", // Send request to {base}/dashboard
      providesTags: ["DashboardMetrics"],
    }),

    // PRODUCTS
    getProducts: build.query<
      Product[],
      { search?: string; collectionQuery?: number } | void
    >({
      // (search) is the parameters from query<Type, parameters>, hence it's string or void (nothing).
      query: (params) => {
        const { search, collectionQuery } = params || {};
        return {
          url: "/products",
          params: {
            ...(search && { search }),
            ...(collectionQuery !== undefined && { collectionQuery }),
          },
        };
      },
      providesTags: ["Products"],
    }),

    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        // Sends a POST request to /products with newProduct as the payload.
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"], // Automatically triggers a re-fetch of the "Products" cache after a successful mutation.
    }),

    editProduct: build.mutation<
      Product,
      { productId: string; updatedData: Partial<Product> }
    >({
      query: ({ productId, updatedData }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: build.mutation<void, string>({
      query: (productId) => ({
        url: `/products/${productId.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // COLLECTIONS
    getCollection: build.query<Collection[], void>({
      query: () => "/collections",
      providesTags: ["Collections"],
    }),

    createCollection: build.mutation<Collection, NewCollection>({
      query: (newCollection) => ({
        url: "/collections",
        method: "POST",
        body: newCollection,
      }),
      invalidatesTags: ["Collections"],
    }),

    editCollection: build.mutation<
      Collection,
      { collectionId: number; updatedData: Partial<Collection> }
    >({
      query: ({ collectionId, updatedData }) => ({
        url: `/collections/${collectionId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Collections"],
    }),

    deleteCollection: build.mutation<void, number>({
      query: (collectionId) => ({
        url: `/collections/${collectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Collections"],
    }),

    // SALES
    getSales: build.query<Sale[], void>({
      query: () => "/sales",
      providesTags: ["Sales"],
    }),

    getSalesReceipts: build.query<SaleReceipt[], void>({
      query: () => "/sales/receipt",
      providesTags: ["SalesReceipt"],
    }),

    getSingleSalesReceipts: build.query<SaleReceipt, number>({
      query: (receiptId) => `/sales/receipt/${receiptId}`,
      providesTags: ["SalesReceipt"],
    }),

    createSalesReceipt: build.mutation<void, SaleReceipt>({
      query: (saleReceiptData) => ({
        url: "/sales/checkout",
        method: "POST",
        body: saleReceiptData,
      }),
      invalidatesTags: ["Sales", "Products"],
    }),

    // USERS
    getUsers: build.query<User[], void>({
      // User[] come from interface above
      query: () => "/users",
      providesTags: ["Users"], // tagTypes
    }),
  }),
});

// Exports auto-generated hooks for each endpoint, enabling easy usage in React components.
// Automatically generated by the createApi function from Redux Toolkit Query (RTK Query).

/*
For each endpoint, a specific hook is created:

Query Endpoints (read-only operations like GET):
Format: use<EndpointName>Query.
Example: useGetProductsQuery is derived from the getProducts endpoint.

Mutation Endpoints (write operations like POST/PUT/DELETE):
Format: use<EndpointName>Mutation.
Example: useCreateProductMutation is derived from the createProduct endpoint.
*/
export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useDeleteProductMutation,
  useGetSalesQuery,
  useGetSalesReceiptsQuery,
  useGetSingleSalesReceiptsQuery,
  useCreateSalesReceiptMutation,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useEditCollectionMutation,
  useDeleteCollectionMutation,
  useGetUsersQuery,
} = api;
