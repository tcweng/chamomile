"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
// Routers created an endpoint for the frontend to connect to our functions we created in Controller
router.get("/", productController_1.getProducts);
router.post("/", productController_1.createProduct);
router.put("/:id", productController_1.updateProduct);
router.delete("/:id", productController_1.deleteProduct);
exports.default = router;
