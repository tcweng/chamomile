import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";

const router = Router();

// Routers created an endpoint for the frontend to connect to our functions we created in Controller
router.get("/", getDashboardMetrics);

export default router;
