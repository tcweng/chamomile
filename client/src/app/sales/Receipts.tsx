import { useGetSalesReceiptsQuery } from "@/state/api";
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
    field: "receiptId",
    headerName: "Receipt No.",
    width: 100,
    valueGetter: (value, row) => `#0000${row.receiptId}`,
  },
  {
    field: "total",
    headerName: "Total ",
    type: "number",
    valueGetter: (value, row) => `RM ${row.total.toFixed(2)}`,
  },
  {
    field: "remark",
    headerName: "Remark ",
    width: 200,
    type: "string",
    valueGetter: (value, row) => row.remark,
  },
];

const Receipts = () => {
  const { data: receipts, isError, isLoading } = useGetSalesReceiptsQuery();

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
        rows={receipts}
        columns={columns}
        getRowId={(row) => row.receiptId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      ></DataGrid>
    </div>
  );
};

export default Receipts;
