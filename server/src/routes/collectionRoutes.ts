import { Router } from "express";
import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from "../controllers/collectionController";

const router = Router();

router.get("/", getCollections);
router.post("/", createCollection);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollection);

export default router;
