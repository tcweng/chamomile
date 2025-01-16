"use client"

import { ExpenseByCategorySummary, useGetExpensesByCategoryQuery } from "@/state/api";
import { useMemo, useState } from "react"
import Header from "../(components)/Header";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { start } from "repl";

type AggregatedDataItem = {
    name: string;
    color?: string;
    amount: number;
}

type AggregatedData = {
    [category: string]: AggregatedDataItem
}

const Expenses = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const {data: expensesData, isLoading, isError} = useGetExpensesByCategoryQuery();
    const expenses = useMemo(() => expensesData ?? [], [expensesData]); // No idea why this line is here, even the tutorial guy said so.

    const parseDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    }

    const aggregatedData: AggregatedDataItem[] = useMemo(() => {
        const filtered: AggregatedData = expenses.filter((data: ExpenseByCategorySummary) => {
            // Check & Match the data with our current selected states (filters) and then return the matched value.
            const matchesCategory = selectedCategory === "All" || data.category === selectedCategory;
            const dataDate = parseDate(data.date)
            const matchesDate = !startDate || !endDate || (dataDate >= startDate && dataDate <= endDate)
            return matchesCategory && matchesDate
        }).reduce((acc: AggregatedData, data: ExpenseByCategorySummary) => { // acc = accumulation data, data = individual data
            const amount = parseInt(data.amount);
            if (!acc[data.category]) { // If Accumulated Data Category doesn't exist
                acc[data.category] = { name: data.category, amount: 0}; // Create a new accummulated data category with its name.
                acc[data.category].color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Create a random color for the new category
                acc[data.category].amount += amount; // Add the amount to the accumulation
            }
            return acc;
        }, {})

        return Object.values(filtered);
    }, [expenses, selectedCategory, startDate, endDate]) // Array for useMemo() to update the page when these values get updated 

    const classNames = {
        label: "block text-sm font-medium text-gray-700",
        selectInput: "mt-1 block w-full pd-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-idigo-500 sm:text-sm rounded-md"
    }

    if (isLoading) {
        return <div className="py-4">Loading...</div>
     }

     if (isError) {
        return <div className='text center text-red-500 py-4'>Failed to fetch expenses</div>
     }

  return (
    <div>
        {/* HEADER */}
        <div className="mb-5">
            <Header name="Expenses"></Header>
            <p className="text-sm text-gray-500">A visual representation of expenses over time.</p>
        </div>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Filter by Category & Date</h3>
                <div className="space-y-4">
                    {/* CATEGORY */}
                    <div>
                        <label htmlFor="category" className={classNames.label}>
                            Category
                        </label>
                        <select id="category" name="category" className={classNames.selectInput} defaultValue="All" onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option>All</option>
                            <option>Office</option>
                            <option>Professional</option>
                            <option>Salaries</option>
                        </select>
                    </div>

                    {/* START DATE */}
                    <div>
                        <label htmlFor="start-date" className={classNames.label}>
                            Start Date
                        </label>
                        <input id="start-date" type="date" name="start-date" className={classNames.selectInput} onChange={(e) => setStartDate(e.target.value)}></input>
                    </div>

                    {/* END DATE */}
                    <div>
                        <label htmlFor="end-date" className={classNames.label}>
                            End Date
                        </label>
                        <input id="end-date" type="date" name="end-date" className={classNames.selectInput} onChange={(e) => setEndDate(e.target.value)}></input>
                    </div>
                </div>
            </div>

            {/* CHARTS */}
            <div className="flex-grow bg-white shadow rounded-lg p4 md:p-6">
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie data={aggregatedData} cx="50%" cy="50%" label outerRadius={150} fill="#8884d8" dataKey="amount" onMouseEnter={(_, index) => setActiveIndex(index)}>
                            {aggregatedData.map((entry: AggregatedDataItem, index: number) => (
                                <Cell key={`cell-$index`} fill={index === activeIndex ? "rgb(29,78,216" : entry.color}></Cell>
                            ))}
                        </Pie>
                        <Tooltip></Tooltip>
                        <Legend></Legend>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  )
}

export default Expenses