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
exports.deleteProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/*
// Controllers is where you setup a function to retrieve a response from our database.
// Here we setup a function to retrieve whatever database that required for our Product page in the frontend.
*/
// Get Products from database via Prisma with a query
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma.products.findMany({
            where: { name: { contains: search } },
            orderBy: { name: "asc" },
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
// To create a database, we will need to request the data from the web and then create it.
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, sku, productImage, price, stockQuantity, collectionId } = 
        // Getting the data from the frontend
        req.body;
        // Populating the product fields with the data received from the request above.
        const product = yield prisma.products.create({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
// To delete a product, we first need to get the unique ID of the product that we interact with.
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the ID from the url parameters
        const { id } = req.params;
        const productId = parseInt(id); // Ensure the id is an integer
        // Check if the product exists
        const product = yield prisma.products.findUnique({
            where: { productId },
        });
        // Delete the product
        yield prisma.products.delete({
            where: { productId },
        });
        res.status(201).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
