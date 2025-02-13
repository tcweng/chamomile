"use client";

import React from "react";
import Header from "../(components)/Header";
import Receipts from "./Receipts";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import Transactions from "./Transactions";

const Sales = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div>
      <Header name="Sales"></Header>
      <TabContext value={value}>
        {/* MENU */}
        <TabList onChange={handleChange}>
          <Tab label="Receipts" value="1"></Tab>
          <Tab label="Transactions" value="2"></Tab>
        </TabList>
        {/* CONTENT */}
        <TabPanel value="1" className="!p-0">
          <Receipts />
        </TabPanel>
        <TabPanel value="2" className="!p-0">
          <Transactions />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Sales;
