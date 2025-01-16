import { Router } from "express";
import {
  createCollection,
  getCollections,
} from "../controllers/collectionController";

const router = Router();

router.get("/", getCollections);
router.post("/", createCollection);

export default router;
