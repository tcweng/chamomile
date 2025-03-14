"use client";

import { Package, ScanLine } from "lucide-react";
import Header from "../(components)/Header";
import { useRouter } from "next/navigation";
import { useGetSalesQuery } from "@/state/api";
import { Divider } from "@mui/material";

// import {
//   CheckCircle,
//   Package,
//   Tag,
//   TrendingDown,
//   TrendingUp,
// } from "lucide-react";
// import CardExpenseSummary from "./CardExpenseSummary";
// import CardPopularProduct from "./CardPopularProduct";
// import CardPurchaseSummary from "./CardPurchaseSummary";
// import CardSalesSummary from "./CardSalesSummary";
// import StatCard from "./StatCard";

const QuickLinkCSS =
  "flex flex-col w-32 h-32 justify-center items-center p-4 bg-white gap-2 rounded-md border border-gray hover:bg-slate-50 transition-all";

const Dashboard = () => {
  const router = useRouter();
  const { data: sales } = useGetSalesQuery();
  const todayDate = new Date().toISOString().split("T")[0];

  const totalOrder = sales?.length;
  const totalSales = sales?.reduce(
    (total, transaction) => total + transaction.totalAmount,
    0
  );
  const todaySales = sales
    ?.filter((transaction) => transaction.timestamp.split("T")[0] === todayDate)
    .reduce((total, transaction) => total + transaction.totalAmount, 0);
  const todayOrders = sales?.filter(
    (transaction) => transaction.timestamp.split("T")[0] === todayDate
  ).length;

  return (
    <div>
      <Header name="Quick Link" />
      <div className="flex flex-row gap-2 my-4">
        <button className={QuickLinkCSS} onClick={() => router.push("/pos")}>
          <ScanLine></ScanLine>
          Point of Sales
        </button>

        <button
          className={QuickLinkCSS}
          onClick={() => router.push("/products")}
        >
          <Package />
          Products
        </button>
      </div>

      <Header name="Analytics" />
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full lg:w-1/2 gap-4 mt-4">
        <div className="flex flex-col rounded-md border border-slate-200 bg-white p-6 gap-2">
          <p className="text-lg">Today&apos;s Sales</p>
          <Divider />
          <p className="text-2xl font-medium">RM {todaySales?.toFixed(2)}</p>
          <p className="text-sm text-gray-400">
            Total Sales: RM {totalSales?.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col rounded-md border border-slate-200 bg-white p-6 gap-2">
          <p className="text-lg">Today&apos;s Orders</p>
          <Divider />
          <p className="text-2xl font-medium">{todayOrders}</p>
          <p className="text-sm text-gray-400">Total Order: {totalOrder}</p>
        </div>
      </div>

      {/* <CardPopularProduct/> */}
      {/* <CardSalesSummary /> */}
      {/* <CardPurchaseSummary />
      <CardExpenseSummary /> */}
      {/* <StatCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Customer Growth",
            amount: "175.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: "10.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      /> */}
      {/* <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Dues",
            amount: "250.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },{
            title: "Pending Orders",
            amount: "147",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      /> */}
      {/* <StatCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Sales",
            amount: "1000.00",
            changePercentage: 20,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: "200.00",
            changePercentage: -10,
            IconComponent: TrendingDown,
          },
        ]}
        /> */}
    </div>
  );
};

export default Dashboard;
