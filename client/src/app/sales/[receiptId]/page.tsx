"use client";

import {
  useGetProductsQuery,
  useGetSingleSalesReceiptsQuery,
} from "@/state/api";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const ReceiptDetails = () => {
  const { receiptId } = useParams();
  const {
    data: receipt,
    isLoading,
    isError,
  } = useGetSingleSalesReceiptsQuery(Number(receiptId));
  const { data: products } = useGetProductsQuery();
  const router = useRouter();

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
    <div>
      <button
        className="flex flex-row gap-2 items-center justify-center my-4"
        onClick={() => router.push(`/sales`)}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-medium my-4">
        Receipt: #0000{receiptId} ({receipt?.remark})
      </h1>
      <p className="my-2 text-slate-500">
        {receipt?.sales?.[0].timestamp.split("T")[0]}
      </p>
      <div className="grid grid-cols-5 w-3/4 gap-2 p-4 border">
        <p>Quantity</p>
        <p>Item</p>
        <p>Unit Price</p>
        <p>Total</p>
        <p>Remark</p>
      </div>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        receipt?.sales?.map((item) => (
          <div
            key={item.saleId}
            className="grid grid-cols-5 gap-2 py-2 w-3/4 p-4 border-b border-x"
          >
            <p>{item.quantity}x</p>
            <p>
              {products?.find((val) => val.productId === item.productId)?.name}
            </p>
            <p>RM {item.unitPrice?.toFixed(2)}</p>
            <p>RM {item.totalAmount.toFixed(2)}</p>
            <p>{item.remark}</p>
          </div>
        ))
      )}
      <p className="text-lg font-medium mt-4">RM {receipt?.total.toFixed(2)}</p>
    </div>
  );
};

export default ReceiptDetails;
