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

// To update a collection, get the unqiue ID of the product that we interact with
export const updateCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const collectionId = parseInt(id);

    const { name } =
      // Getting the data from the frontend
      req.body;

    const updatedCollection = await prisma.collections.update({
      where: { collectionId },
      data: {
        ...(name && { name }), // Update name if provided
      },
    });
    res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: "Error updating collection", error });
  }
};

// To delete a collection, we first need to get the unique ID of the product that we interact with.
export const deleteCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the ID from the url parameters
    const { id } = req.params;
    const collectionId = parseInt(id); // Ensure the id is an integer

    // Check if the product exists
    const collection = await prisma.collections.findUnique({
      where: { collectionId },
    });

    // Delete the product
    await prisma.collections.delete({
      where: { collectionId },
    });
    res.status(201).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting collection" });
  }
};
