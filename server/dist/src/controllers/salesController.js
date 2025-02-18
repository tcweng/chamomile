"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceipt = exports.createSalesReceipt = exports.getReceipt = exports.getAllReceipt = exports.getSales = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield prisma.sales.findMany({
            include: { product: true },
            orderBy: { timestamp: "desc" },
        });
        res.json(sales);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getSales = getSales;
const getAllReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receipts = yield prisma.salesReceipt.findMany({
            include: { sales: true },
            orderBy: {
                receiptId: "desc",
            },
        });
        res.json(receipts);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving receipts " });
    }
});
exports.getAllReceipt = getAllReceipt;
const getReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiptId } = req.params;
    try {
        const receipt = yield prisma.salesReceipt.findUnique({
            where: { receiptId: Number(receiptId) },
            include: { sales: true }, // Include associated sales
        });
        res.json(receipt);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving receipt" });
    }
});
exports.getReceipt = getReceipt;
const createSalesReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart, total, remark } = req.body; // Cart is an array of items
    try {
        // Create SalesReceipt
        const receipt = yield prisma.salesReceipt.create({
            data: {
                total: total,
                remark,
            },
        });
        // Create Sales for each individual items in Cart
        const salesPromises = cart.map((item) => {
            return prisma.sales.create({
                data: {
                    productId: item.productId,
                    receiptId: receipt.receiptId, // Created from above
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalAmount: item.totalAmount,
                    remark: item.remark,
                },
            });
        });
        // Update Product Stock
        const stockPromises = cart.map((item) => {
            return prisma.products.update({
                where: { productId: item.productId },
                data: { stockQuantity: { decrement: item.quantity } },
            });
        });
        yield Promise.all([...salesPromises, ...stockPromises]);
        res.status(201).json({ message: "Checkout successful", receipt });
    }
    catch (error) {
        console.log("Checkout error:", error);
        res.status(500).json({ message: "Checkout failed" });
    }
});
exports.createSalesReceipt = createSalesReceipt;
const deleteReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiptId } = req.params;
    try {
        // Fetch all sales related to the receipt
        const sales = yield prisma.sales.findMany({
            where: { receiptId: Number(receiptId) },
        });
        // Restore stock quantities
        const stockUpdates = sales.map((sale) => prisma.products.update({
            where: { productId: sale.productId },
            data: { stockQuantity: { increment: sale.quantity } },
        }));
        // Execute stock updates before deleting transactions
        yield Promise.all(stockUpdates);
        // Delete all sales associated with the receipt
        yield prisma.sales.deleteMany({
            where: { receiptId: Number(receiptId) },
        });
        // Delete the receipt
        yield prisma.salesReceipt.delete({
            where: { receiptId: Number(receiptId) },
        });
        res
            .status(200)
            .json({ message: "Receipt and transactions deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting receipt:", error);
        res.status(500).json({ message: "Failed to delete receipt." });
    }
});
exports.deleteReceipt = deleteReceipt;
