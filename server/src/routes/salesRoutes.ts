import { Router } from "express";
import {
  createSalesReceipt,
  getAllReceipt,
  getReceipt,
  getSales,
} from "../controllers/salesController";

const router = Router();

// Routers created an endpoint for the frontend to connect to our functions we created in Controller
router.get("/", getSales);
router.post("/checkout", createSalesReceipt);
router.get("/receipt", getAllReceipt); // http://localhost:8000/sales/receipt
router.get("/receipt/:receiptId", getReceipt);

export default router;
