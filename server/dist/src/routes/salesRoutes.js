"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salesController_1 = require("../controllers/salesController");
const router = (0, express_1.Router)();
// Routers created an endpoint for the frontend to connect to our functions we created in Controller
router.get("/", salesController_1.getSales);
router.post("/checkout", salesController_1.createSalesReceipt);
router.get("/receipt", salesController_1.getAllReceipt); // http://localhost:8000/sales/receipt
router.get("/receipt/:receiptId", salesController_1.getReceipt);
exports.default = router;
