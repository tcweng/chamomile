import { useGetSalesQuery, useGetSalesReceiptsQuery } from "@/state/api";
import React from "react";
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "timestamp",
    headerName: "Date",
    width: 100,
    type: "string",
    valueGetter: (value, row) => row.timestamp.split("T")[0],
  },
  {
    field: "name",
    headerName: "Item",
    width: 200,
    valueGetter: (value, row) => `${row.product.name}`,
  },
  {
    field: "price",
    headerName: "Price",
    width: 90,
    type: "number",
    valueGetter: (value, row) => `RM ${row.product.price.toFixed(2)}`,
  },
  {
    field: "quantity",
    headerName: "Qty",
    width: 50,
    type: "number",
    valueGetter: (value, row) => `${row.quantity}`,
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    type: "number",
    valueGetter: (value, row) => `RM ${row.totalAmount.toFixed(2)}`,
  },
  {
    field: "remark",
    headerName: "Remark ",
    width: 200,
    type: "string",
    valueGetter: (value, row) => row.remark,
  },
];

const Transactions = () => {
  const { data: sales, isError, isLoading } = useGetSalesQuery();

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text center text-red-500 py-4">
        Failed to fetch Sales data.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DataGrid
        rows={sales}
        columns={columns}
        getRowId={(row) => row.saleId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      ></DataGrid>
    </div>
  );
};

export default Transactions;
