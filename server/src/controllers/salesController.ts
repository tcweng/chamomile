import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = await prisma.sales.findMany({
      include: { product: true },
      orderBy: { timestamp: "desc" },
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getAllReceipt = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const receipts = await prisma.salesReceipt.findMany({
      include: { sales: true },
      orderBy: {
        receiptId: "desc",
      },
    });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving receipts " });
  }
};

export const getReceipt = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { receiptId } = req.params;
  try {
    const receipt = await prisma.salesReceipt.findUnique({
      where: { receiptId: Number(receiptId) },
      include: { sales: true }, // Include associated sales
    });
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving receipt" });
  }
};

export const createSalesReceipt = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cart, total, remark } = req.body; // Cart is an array of items
  try {
    // Create SalesReceipt
    const receipt = await prisma.salesReceipt.create({
      data: {
        total: total,
        remark,
      },
    });

    // Create Sales for each individual items in Cart
    const salesPromises = cart.map((item: any) => {
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
    const stockPromises = cart.map((item: any) => {
      return prisma.products.update({
        where: { productId: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    });

    await Promise.all([...salesPromises, ...stockPromises]);
    res.status(201).json({ message: "Checkout successful", receipt });
  } catch (error) {
    console.log("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed" });
  }
};

export const deleteReceipt = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { receiptId } = req.params;

  try {
    // Fetch all sales related to the receipt
    const sales = await prisma.sales.findMany({
      where: { receiptId: Number(receiptId) },
    });

    // Restore stock quantities
    const stockUpdates = sales.map((sale) =>
      prisma.products.update({
        where: { productId: sale.productId },
        data: { stockQuantity: { increment: sale.quantity } },
      })
    );

    // Execute stock updates before deleting transactions
    await Promise.all(stockUpdates);

    // Delete all sales associated with the receipt
    await prisma.sales.deleteMany({
      where: { receiptId: Number(receiptId) },
    });

    // Delete the receipt
    await prisma.salesReceipt.delete({
      where: { receiptId: Number(receiptId) },
    });

    res
      .status(200)
      .json({ message: "Receipt and transactions deleted successfully." });
  } catch (error) {
    console.error("Error deleting receipt:", error);
    res.status(500).json({ message: "Failed to delete receipt." });
  }
};
