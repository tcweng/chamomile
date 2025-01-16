"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collectionController_1 = require("../controllers/collectionController");
const router = (0, express_1.Router)();
router.get("/", collectionController_1.getCollections);
router.post("/", collectionController_1.createCollection);
exports.default = router;
