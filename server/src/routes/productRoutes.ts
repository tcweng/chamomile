import { Router } from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

// Routers created an endpoint for the frontend to connect to our functions we created in Controller
router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

export default router;
