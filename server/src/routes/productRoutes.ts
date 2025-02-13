import { Router } from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/productController";

const router = Router();

// Routers created an endpoint for the frontend to connect to our functions we created in Controller
router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
