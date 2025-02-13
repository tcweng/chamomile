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
exports.deleteCollection = exports.updateCollection = exports.createCollection = exports.getCollections = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCollections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const collections = yield prisma.collections.findMany({
            where: { name: { contains: search } },
            include: { products: true },
            orderBy: { collectionId: "asc" },
        });
        res.json(collections);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving collections" });
    }
});
exports.getCollections = getCollections;
const createCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = 
        // Getting the data from the frontend
        req.body;
        // Populating the product fields with the data received from the request above.
        const collection = yield prisma.collections.create({
            data: {
                name,
            },
        });
        res.status(201).json(collection);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating collection" });
    }
});
exports.createCollection = createCollection;
// To update a collection, get the unqiue ID of the product that we interact with
const updateCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const collectionId = parseInt(id);
        const { name } = 
        // Getting the data from the frontend
        req.body;
        const updatedCollection = yield prisma.collections.update({
            where: { collectionId },
            data: Object.assign({}, (name && { name })),
        });
        res.status(200).json(updatedCollection);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating collection", error });
    }
});
exports.updateCollection = updateCollection;
// To delete a collection, we first need to get the unique ID of the product that we interact with.
const deleteCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the ID from the url parameters
        const { id } = req.params;
        const collectionId = parseInt(id); // Ensure the id is an integer
        // Check if the product exists
        const collection = yield prisma.collections.findUnique({
            where: { collectionId },
        });
        // Delete the product
        yield prisma.collections.delete({
            where: { collectionId },
        });
        res.status(201).json({ message: "Collection deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting collection" });
    }
});
exports.deleteCollection = deleteCollection;
