import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
// Controllers is where you setup a function to retrieve a response from our database.
// Here we setup a function to retrieve whatever database that required for our Dashboard page in the frontend.
*/

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });
    res.json({
      popularProducts,
      //   salesSummary,
      //   purchaseSummary,
      //   expenseSummary,
      //   expenseByCategorySummary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};
