import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
// Controllers is where you setup a function to retrieve a response from our database.
// Here we setup a function to retrieve whatever database that required for our Product page in the frontend.
*/

// Get Products from database via Prisma with a query
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: { name: { contains: search } },
      orderBy: { name: "asc" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

// To create a database, we will need to request the data from the web and then create it.
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, sku, productImage, price, stockQuantity, collectionId } =
      // Getting the data from the frontend
      req.body;

    // Populating the product fields with the data received from the request above.
    const product = await prisma.products.create({
      data: {
        name,
        sku,
        productImage,
        price,
        stockQuantity,
        collectionId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

// To delete a product, we first need to get the unique ID of the product that we interact with.
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the ID from the url parameters
    const { id } = req.params;
    const productId = parseInt(id); // Ensure the id is an integer

    // Check if the product exists
    const product = await prisma.products.findUnique({
      where: { productId },
    });

    // Delete the product
    await prisma.products.delete({
      where: { productId },
    });
    res.status(201).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
