import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCollections = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const collections = await prisma.collections.findMany({
      where: { name: { contains: search } },
      include: { products: true },
      orderBy: { collectionId: "asc" },
    });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving collections" });
  }
};

export const createCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } =
      // Getting the data from the frontend
      req.body;

    // Populating the product fields with the data received from the request above.
    const collection = await prisma.collections.create({
      data: {
        name,
      },
    });
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Error creating collection" });
  }
};
