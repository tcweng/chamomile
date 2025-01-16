"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
// Routers created an endpoint for the frontend to connect to our functions we created in Controller
router.get("/", dashboardController_1.getDashboardMetrics);
exports.default = router;
