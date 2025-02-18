import {
  useDeleteReceiptMutation,
  useGetSalesReceiptsQuery,
} from "@/state/api";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Receipts = () => {
  const { data: receipts, isError, isLoading } = useGetSalesReceiptsQuery();
  const router = useRouter();
  const [deleteReceipt] = useDeleteReceiptMutation();

  const handleDeleteReceipt = async (receiptId: number) => {
    try {
      await deleteReceipt(receiptId);
      console.log("Receipt deleted successfully!");
    } catch (error) {
      console.error("Failed to delete receipt:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "view",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <button
          className="flex w-full justify-center"
          onClick={() => router.push(`/sales/${params.row.receiptId}`)}
        >
          <Eye className="w-4 h-4 text-gray-500"></Eye>
        </button>
      ),
    },
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
    {
      field: "actions",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <button onClick={() => handleDeleteReceipt(params.row.receiptId)}>
          <Trash2 className="w-5 h-5"></Trash2>
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
        Failed to fetch Sales data.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DataGrid
        rows={receipts}
        columns={columns}
        rowHeight={48}
        columnHeaderHeight={48}
        getRowId={(row) => row.receiptId}
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      ></DataGrid>
    </div>
  );
};

export default Receipts;
